const AuthService = require('../services/AuthService');
const AlunoService = require('../services/AlunoService');
const { registrarAuditoria } = require('../utils/auditoria');
const { responderErro } = require('../utils/erro');

async function criar(req, res) {
  try {
    const aluno = await AuthService.cadastrarAluno(req.body);
    await registrarAuditoria(
      { id_usuario: aluno.id_usuario, nome: aluno.nome },
      'inclusao',
      'usuario',
      aluno.id_usuario,
      {
        id_usuario: aluno.id_usuario,
        nome: aluno.nome,
        email: aluno.email,
        tipo: 'aluno'
      }
    );
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
    const detalhes = {};
    for (const campo of ['nome', 'email', 'dt_nasc']) {
      if (req.body[campo] !== undefined) detalhes[campo] = req.body[campo];
    }
    await registrarAuditoria(
      req.usuario,
      'alteracao',
      'usuario',
      aluno.id_usuario,
      detalhes
    );
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
