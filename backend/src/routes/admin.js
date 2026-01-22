const express = require('express');
const { query } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', authenticate(['admin']), async (req, res) => {
  const result = await query(
    `SELECT orders.id, orders.amount_total, orders.status, orders.created_at,
            users.email AS buyer_email, events.name AS event_name
     FROM orders
     JOIN users ON users.id = orders.buyer_id
     JOIN events ON events.id = orders.event_id
     ORDER BY orders.created_at DESC`
  );
  return res.json(result.rows);
});

router.get('/validations', authenticate(['admin']), async (req, res) => {
  const result = await query(
    `SELECT validations.id, validations.validated_at, tickets.qr_code, events.name AS event_name
     FROM validations
     JOIN tickets ON tickets.id = validations.ticket_id
     JOIN events ON events.id = tickets.event_id
     ORDER BY validations.validated_at DESC`
  );
  return res.json(result.rows);
});

router.get('/settlements', authenticate(['admin']), async (req, res) => {
  const result = await query(
    `SELECT events.id, events.name, SUM(orders.amount_total) AS total_collected,
            SUM(orders.fee_total) AS total_fees, (SUM(orders.amount_total) - SUM(orders.fee_total)) AS net_to_organizer
     FROM orders
     JOIN events ON events.id = orders.event_id
     WHERE orders.status = 'paid'
     GROUP BY events.id, events.name
     ORDER BY events.name ASC`
  );
  return res.json(result.rows);
});

module.exports = router;
