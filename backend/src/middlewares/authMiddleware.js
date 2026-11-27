const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function authMiddleware(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  try {
    req.usuario = jwt.verify(cabecalho.slice(7), authConfig.secret);
    return next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = authMiddleware;
