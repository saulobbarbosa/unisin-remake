const AvaliacaoService = require('../services/AvaliacaoService');
const { responderErro } = require('../utils/erro');

async function iniciar(req, res) {
  try {
    const avaliacao = await AvaliacaoService.iniciar(req.usuario.id_usuario);
    return res.json(avaliacao);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function finalizar(req, res) {
  try {
    const resultado = await AvaliacaoService.finalizar(
      req.usuario.id_usuario,
      req.body.respostas
    );
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { iniciar, finalizar };
