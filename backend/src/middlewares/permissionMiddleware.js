function permitir(...tipos) {
  return (req, res, next) => {
    if (!req.usuario || !tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    return next();
  };
}

module.exports = permitir;
