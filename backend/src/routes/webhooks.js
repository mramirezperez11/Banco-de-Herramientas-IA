const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { withTransaction } = require('../db');

const router = express.Router();

router.post('/payments', async (req, res) => {
  const { orderId, paymentReference, status } = req.body;
  if (!orderId || !paymentReference || !status) {
    return res.status(400).json({ error: 'Payload inválido' });
  }

  if (status !== 'paid') {
    return res.status(200).json({ received: true, ignored: true });
  }

  try {
    const result = await withTransaction(async (client) => {
      const orderResult = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
      if (orderResult.rows.length === 0) {
        return null;
      }
      const order = orderResult.rows[0];
      if (order.status === 'paid') {
        return order;
      }

      await client.query(
        'UPDATE orders SET status = $1, payment_reference = $2 WHERE id = $3',
        ['paid', paymentReference, orderId]
      );

      const tickets = [];
      for (let i = 0; i < order.quantity; i += 1) {
        const ticketId = uuidv4();
        const qrCode = uuidv4();
        const ticketResult = await client.query(
          `INSERT INTO tickets (id, event_id, buyer_id, order_id, qr_code, status)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, qr_code, status`,
          [ticketId, order.event_id, order.buyer_id, order.id, qrCode, 'issued']
        );
        tickets.push(ticketResult.rows[0]);
      }

      return { orderId: order.id, tickets };
    });

    if (!result) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    return res.json({ received: true, ...result });
  } catch (error) {
    return res.status(500).json({ error: 'Error procesando pago' });
  }
});

module.exports = router;
