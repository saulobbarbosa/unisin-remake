const AuthService = require('../services/AuthService');
const AlunoService = require('../services/AlunoService');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const aluno = await AuthService.cadastrarAluno(req.body);
    return res.status(201).json(aluno);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function me(req, res) {
  try {
    const aluno = await AlunoService.buscarPorId(req.usuario.id_usuario);
    return res.json(aluno);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscar(req, res) {
  try {
    const aluno = await AlunoService.buscarPorId(Number(req.params.id));
    return res.json(aluno);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function listar(req, res) {
  try {
    const alunos = await AlunoService.listar();
    return res.json(alunos);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizarMe(req, res) {
  try {
    const aluno = await AlunoService.atualizarMe(req.usuario.id_usuario, req.body);
    return res.json(aluno);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function ranking(req, res) {
  try {
    const classificacao = await AlunoService.ranking(req.usuario.id_usuario);
    return res.json(classificacao);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { criar, me, buscar, listar, atualizarMe, ranking };
