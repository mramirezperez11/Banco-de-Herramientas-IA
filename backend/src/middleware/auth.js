const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    if (roles.length > 0 && !roles.includes(payload.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
  authenticate
};
