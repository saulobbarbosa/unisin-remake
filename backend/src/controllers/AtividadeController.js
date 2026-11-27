const AtividadeService = require('../services/AtividadeService');
const { registrarAuditoria } = require('../utils/auditoria');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const atividade = await AtividadeService.criar(req.usuario.id_usuario, req.body);
    await registrarAuditoria(req.usuario, 'inclusao', 'atividade', atividade.id_atividade, {
      id_atividade: atividade.id_atividade,
      nome_atividade: atividade.nome_atividade,
      tipo: atividade.tipo,
      id_nivel_ensino: atividade.id_nivel_ensino
    });
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
    const detalhes = { id_atividade: atividade.id_atividade };
    for (const campo of ['nome_atividade', 'tipo', 'id_nivel_ensino']) {
      if (req.body[campo] !== undefined) detalhes[campo] = req.body[campo];
    }
    await registrarAuditoria(
      req.usuario,
      'alteracao',
      'atividade',
      atividade.id_atividade,
      detalhes
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
    await registrarAuditoria(
      req.usuario,
      atividade.ativo ? 'alteracao' : 'exclusao',
      'atividade',
      atividade.id_atividade,
      {
        id_atividade: atividade.id_atividade,
        nome_atividade: atividade.nome_atividade,
        ativo: atividade.ativo
      }
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
