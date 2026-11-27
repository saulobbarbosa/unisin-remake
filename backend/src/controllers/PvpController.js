const PvpService = require('../services/PvpService');
const { responderErro } = require('../utils/erro');

async function criarConvite(req, res) {
  try {
    const convite = await PvpService.criarConvite(
      req.usuario.id_usuario,
      req.body.id_amigo
    );
    return res.status(201).json(convite);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function aceitarConvite(req, res) {
  try {
    const partida = await PvpService.aceitarConvite(
      req.usuario.id_usuario,
      req.params.id
    );
    return res.json(partida);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function recusarConvite(req, res) {
  try {
    const resultado = await PvpService.recusarConvite(
      req.usuario.id_usuario,
      req.params.id
    );
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function partidaAtual(req, res) {
  try {
    const partida = PvpService.partidaAtual(req.usuario.id_usuario);
    return res.json(partida);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function vitorias(req, res) {
  try {
    const resultado = await PvpService.vitorias(req.usuario.id_usuario);
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { criarConvite, aceitarConvite, recusarConvite, partidaAtual, vitorias };
