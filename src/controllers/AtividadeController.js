const AtividadeService = require('../services/AtividadeService');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const atividade = await AtividadeService.criar(req.usuario.id_usuario, req.body);
    return res.status(201).json(atividade);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    const atividades = await AtividadeService.listar(req.query, req.usuario);
    return res.json(atividades);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscar(req, res) {
  try {
    const atividade = await AtividadeService.buscarPorId(
      Number(req.params.id),
      req.usuario
    );
    return res.json(atividade);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const atividade = await AtividadeService.atualizar(
      Number(req.params.id),
      req.usuario.id_usuario,
      req.body
    );
    return res.json(atividade);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function alterarStatus(req, res) {
  try {
    const atividade = await AtividadeService.alterarStatus(
      Number(req.params.id),
      req.usuario.id_usuario,
      req.body.ativo
    );
    return res.json(atividade);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function responder(req, res) {
  try {
    const resultado = await AtividadeService.responder(
      req.usuario.id_usuario,
      Number(req.params.id),
      req.body.id_resposta
    );
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function concluidas(req, res) {
  try {
    const atividades = await AtividadeService.concluidas(req.usuario.id_usuario);
    return res.json(atividades);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { criar, listar, buscar, atualizar, alterarStatus, responder, concluidas };
