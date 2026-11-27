const AmizadeService = require('../services/AmizadeService');
const { responderErro } = require('../utils/erro');

async function listar(req, res) {
  try {
    const amigos = await AmizadeService.listar(req.usuario.id_usuario);
    return res.json(amigos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscar(req, res) {
  try {
    const alunos = await AmizadeService.buscar(req.usuario.id_usuario, req.query.nome);
    return res.json(alunos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function adicionar(req, res) {
  try {
    const amigo = await AmizadeService.adicionar(
      req.usuario.id_usuario,
      req.body.id_amigo
    );
    return res.status(201).json(amigo);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function remover(req, res) {
  try {
    const resultado = await AmizadeService.remover(
      req.usuario.id_usuario,
      req.params.id
    );
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, buscar, adicionar, remover };
