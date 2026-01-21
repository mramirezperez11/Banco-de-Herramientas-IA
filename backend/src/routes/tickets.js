const express = require('express');
const { query, withTransaction } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate(['buyer']), async (req, res) => {
  const result = await query(
    `SELECT tickets.id, tickets.qr_code, tickets.status, tickets.created_at,
            events.name AS event_name, events.start_time, events.venue
     FROM tickets
     JOIN events ON events.id = tickets.event_id
     WHERE tickets.buyer_id = $1
     ORDER BY tickets.created_at DESC`,
    [req.user.id]
  );
  return res.json(result.rows);
});

router.post('/:id/validate', authenticate(['organizer', 'admin']), async (req, res) => {
  try {
    const validation = await withTransaction(async (client) => {
      const ticketResult = await client.query('SELECT * FROM tickets WHERE id = $1 FOR UPDATE', [req.params.id]);
      if (ticketResult.rows.length === 0) {
        return null;
      }
      const ticket = ticketResult.rows[0];
      if (ticket.status !== 'issued') {
        throw new Error('Ticket ya utilizado o anulado');
      }

      await client.query('UPDATE tickets SET status = $1 WHERE id = $2', ['validated', ticket.id]);
      const validationResult = await client.query(
        'INSERT INTO validations (ticket_id, validated_by) VALUES ($1, $2) RETURNING *',
        [ticket.id, req.user.id]
      );
      return validationResult.rows[0];
    });

    if (!validation) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    return res.json(validation);
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
});

module.exports = router;
