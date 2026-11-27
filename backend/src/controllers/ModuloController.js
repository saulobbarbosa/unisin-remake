const ModuloService = require('../services/ModuloService');
const { responderErro } = require('../utils/erro');

async function listar(req, res) {
  try {
    const modulos = await ModuloService.listar(req.query);
    return res.json(modulos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscar(req, res) {
  try {
    const modulo = await ModuloService.buscarPorId(Number(req.params.id), req.usuario);
    return res.json(modulo);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const modulo = await ModuloService.criar(req.body);
    return res.status(201).json(modulo);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const modulo = await ModuloService.atualizar(Number(req.params.id), req.body);
    return res.json(modulo);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function associarAluno(req, res) {
  try {
    const matricula = await ModuloService.associarAluno(
      Number(req.params.id),
      req.body
    );
    return res.status(201).json(matricula);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function meus(req, res) {
  try {
    const modulos = await ModuloService.meus(req.usuario.id_usuario);
    return res.json(modulos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizarProgresso(req, res) {
  try {
    const matricula = await ModuloService.atualizarProgresso(
      req.usuario.id_usuario,
      Number(req.params.id),
      req.body
    );
    return res.json(matricula);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, buscar, criar, atualizar, associarAluno, meus, atualizarProgresso };
