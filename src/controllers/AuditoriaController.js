const AuditoriaService = require('../services/AuditoriaService');
const { responderErro } = require('../utils/erro');

async function listar(req, res) {
  try {
    const blocos = await AuditoriaService.listar();
    return res.json(blocos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function verificar(req, res) {
  try {
    const resultado = await AuditoriaService.verificar();
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, verificar };
