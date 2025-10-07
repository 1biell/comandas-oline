const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'chavesecreta';

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.empresaId = decoded.empresaId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = autenticar;
