const express = require('express');
const { query } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/simulate', authenticate(['buyer']), async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId requerido' });
  }

  const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  const order = result.rows[0];
  if (order.buyer_id !== req.user.id) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  if (order.status !== 'pending') {
    return res.status(409).json({ error: 'La orden no está pendiente' });
  }

  const paymentReference = `SIM-${Date.now()}`;
  return res.json({
    orderId: order.id,
    amountTotal: order.amount_total,
    currency: 'CRC',
    paymentReference,
    nextStep: 'Call /api/webhooks/payments to confirm payment.'
  });
});

module.exports = router;
