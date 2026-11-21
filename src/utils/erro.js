function criarErro(mensagem, status = 400) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function responderErro(res, erro) {
  return res.status(erro.status || 500).json({ erro: erro.message });
}

module.exports = { criarErro, responderErro };
