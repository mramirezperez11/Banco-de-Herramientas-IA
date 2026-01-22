const express = require('express');
const { query } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', authenticate(['buyer', 'admin']), async (req, res) => {
  const result = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Orden no encontrada' });
  }

  const order = result.rows[0];
  if (req.user.role === 'buyer' && order.buyer_id !== req.user.id) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  return res.json(order);
});

module.exports = router;
