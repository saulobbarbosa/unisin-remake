const ConquistaService = require('../services/ConquistaService');
const { responderErro } = require('../utils/erro');

async function listar(req, res) {
  try {
    const conquistas = await ConquistaService.listar(req.usuario);
    return res.json(conquistas);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function minhas(req, res) {
  try {
    const conquistas = await ConquistaService.minhas(req.usuario.id_usuario);
    return res.json(conquistas);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const conquista = await ConquistaService.criar(req.body);
    return res.status(201).json(conquista);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const conquista = await ConquistaService.atualizar(
      Number(req.params.id),
      req.body
    );
    return res.json(conquista);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function alterarStatus(req, res) {
  try {
    const conquista = await ConquistaService.alterarStatus(
      Number(req.params.id),
      req.body.ativa
    );
    return res.json(conquista);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, minhas, criar, atualizar, alterarStatus };
