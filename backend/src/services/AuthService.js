const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  sequelize,
  Usuario,
  Aluno,
  Escola,
  Professor,
  Administrador
} = require('../models');
const authConfig = require('../config/auth');
const { criarErro } = require('../utils/erro');

function exigir(dados, campos) {
  for (const campo of campos) {
    if (dados[campo] === undefined || dados[campo] === null || dados[campo] === '') {
      throw criarErro(`Campo obrigatório: ${campo}`);
    }
  }
}

function semSenha(usuario) {
  const dados = usuario.get({ plain: true });
  delete dados.senha;
  return dados;
}

async function criarUsuarioComPerfil(dados, criarPerfil) {
  exigir(dados, ['nome', 'dt_nasc', 'email', 'senha']);

  const existente = await Usuario.scope('comSenha').findOne({
    where: { email: dados.email }
  });
  if (existente) throw criarErro('E-mail já cadastrado', 409);

  const senha = await bcrypt.hash(dados.senha, process.env.NODE_ENV === 'test' ? 4 : 10);

  return sequelize.transaction(async (transaction) => {
    const usuario = await Usuario.create(
      {
        nome: dados.nome,
        dt_nasc: dados.dt_nasc,
        email: dados.email,
        senha
      },
      { transaction }
    );

    const perfil = await criarPerfil(usuario, transaction);
    return { usuario: semSenha(usuario), perfil };
  });
}

async function detectarTipo(id_usuario) {
  const [administrador, escola, professor, aluno] = await Promise.all([
    Administrador.findByPk(id_usuario),
    Escola.findOne({ where: { id_usuario } }),
    Professor.findByPk(id_usuario),
    Aluno.findByPk(id_usuario)
  ]);

  if (administrador) return 'administrador';
  if (escola) return 'escola';
  if (professor) return 'professor';
  if (aluno) return 'aluno';
  return null;
}

async function cadastrarAluno(dados) {
  const { usuario } = await criarUsuarioComPerfil(dados, (novoUsuario, transaction) =>
    Aluno.create({ id_usuario: novoUsuario.id_usuario }, { transaction })
  );
  return { ...usuario, tipo: 'aluno' };
}

async function cadastrarEscola(dados) {
  const { usuario, perfil } = await criarUsuarioComPerfil(dados, (novoUsuario, transaction) =>
    Escola.create(
      {
        id_usuario: novoUsuario.id_usuario,
        nome: dados.nome,
        cep: dados.cep,
        rua: dados.rua,
        estado: dados.estado,
        cidade: dados.cidade,
        numero: dados.numero
      },
      { transaction }
    )
  );

  return { ...usuario, tipo: 'escola', id_escola: perfil.id_escola };
}

async function cadastrarAdministrador(dados) {
  const { usuario } = await criarUsuarioComPerfil(dados, (novoUsuario, transaction) =>
    Administrador.create({ id_usuario: novoUsuario.id_usuario }, { transaction })
  );
  return { ...usuario, tipo: 'administrador' };
}

async function cadastrarProfessor(id_escola, dados) {
  const escola = await Escola.findByPk(id_escola);
  if (!escola) throw criarErro('Escola não encontrada', 404);

  const { usuario } = await criarUsuarioComPerfil(dados, (novoUsuario, transaction) =>
    Professor.create(
      { id_usuario: novoUsuario.id_usuario, id_escola },
      { transaction }
    )
  );

  return { ...usuario, tipo: 'professor', id_escola };
}

async function login(email, senha) {
  exigir({ email, senha }, ['email', 'senha']);

  const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
  if (!usuario) throw criarErro('Credenciais inválidas', 401);

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw criarErro('Credenciais inválidas', 401);

  const tipo = await detectarTipo(usuario.id_usuario);
  if (!tipo) throw criarErro('Usuário sem perfil vinculado', 401);

  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, tipo },
    authConfig.secret,
    { expiresIn: authConfig.expiresIn }
  );

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo
    }
  };
}

module.exports = {
  cadastrarAluno,
  cadastrarEscola,
  cadastrarProfessor,
  cadastrarAdministrador,
  login
};
