const express = require('express');
const { query, withTransaction } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await query(
    'SELECT id, name, description, start_time, venue, capacity, price_crc, status FROM events WHERE status = $1 ORDER BY start_time ASC',
    ['active']
  );
  return res.json(result.rows);
});

router.post('/', authenticate(['organizer']), async (req, res) => {
  const { name, description, startTime, venue, capacity, priceCrc } = req.body;
  if (!name || !startTime || !venue || !capacity || !priceCrc) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const result = await query(
    `INSERT INTO events (organizer_id, name, description, start_time, venue, capacity, price_crc)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, start_time, venue, capacity, price_crc`,
    [req.user.id, name, description || '', startTime, venue, capacity, priceCrc]
  );

  return res.status(201).json(result.rows[0]);
});

router.get('/:id', async (req, res) => {
  const eventResult = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (eventResult.rows.length === 0) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }

  const event = eventResult.rows[0];
  const soldResult = await query(
    'SELECT COALESCE(SUM(quantity), 0) AS reserved FROM orders WHERE event_id = $1 AND status IN ($2, $3)',
    [event.id, 'pending', 'paid']
  );
  const reserved = Number(soldResult.rows[0].reserved);
  const available = Math.max(event.capacity - reserved, 0);

  return res.json({
    ...event,
    reserved,
    available
  });
});

router.get('/:id/sales', authenticate(['organizer']), async (req, res) => {
  const result = await query(
    `SELECT status, COUNT(*) AS orders, SUM(quantity) AS tickets, SUM(amount_total) AS total_crc
     FROM orders
     WHERE event_id = $1
     GROUP BY status`,
    [req.params.id]
  );
  return res.json(result.rows);
});

router.post('/:id/hold', authenticate(['buyer']), async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const order = await withTransaction(async (client) => {
      const eventResult = await client.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [req.params.id]);
      if (eventResult.rows.length === 0) {
        return null;
      }
      const event = eventResult.rows[0];
      if (event.status !== 'active') {
        throw new Error('Evento no disponible');
      }
      const reservedResult = await client.query(
        'SELECT COALESCE(SUM(quantity), 0) AS reserved FROM orders WHERE event_id = $1 AND status IN ($2, $3)',
        [event.id, 'pending', 'paid']
      );
      const reserved = Number(reservedResult.rows[0].reserved);
      if (reserved + quantity > event.capacity) {
        throw new Error('Aforo insuficiente');
      }

      const { calculateFees } = require('../utils/fees');
      const fees = calculateFees(event.price_crc, quantity);
      const orderResult = await client.query(
        `INSERT INTO orders (buyer_id, event_id, quantity, amount_subtotal, fee_total, amount_total, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [req.user.id, event.id, quantity, fees.subtotal, fees.totalFees, fees.total, 'pending']
      );
      return orderResult.rows[0];
    });

    if (!order) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    return res.status(201).json(order);
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

module.exports = router;
