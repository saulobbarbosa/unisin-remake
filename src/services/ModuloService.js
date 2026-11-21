const {
  ModuloEnsino,
  AlunoModuloEnsino,
  NivelEnsino,
  Aluno,
  Usuario
} = require('../models');
const { criarErro } = require('../utils/erro');

const STATUS = ['nao_iniciado', 'em_andamento', 'concluido'];

function niveisUnicos(matriculas) {
  const mapa = new Map();
  for (const matricula of matriculas) {
    if (!matricula.nivelEnsino) continue;
    mapa.set(matricula.nivelEnsino.id_nivel_ensino, {
      id_nivel_ensino: matricula.nivelEnsino.id_nivel_ensino,
      nome: matricula.nivelEnsino.nome
    });
  }
  return [...mapa.values()];
}

function formatarMatricula(matricula, incluirAluno = false) {
  const dados = {
    id_modulo_ensino: matricula.id_modulo_ensino,
    id_nivel_ensino: matricula.id_nivel_ensino,
    nivel_ensino: matricula.nivelEnsino
      ? {
          id_nivel_ensino: matricula.nivelEnsino.id_nivel_ensino,
          nome: matricula.nivelEnsino.nome
        }
      : null,
    status: matricula.status,
    data_conclusao: matricula.data_conclusao
  };

  if (incluirAluno && matricula.aluno && matricula.aluno.usuario) {
    dados.id_usuario = matricula.aluno_id_usuario;
    dados.nome = matricula.aluno.usuario.nome;
  }

  return dados;
}

async function listar(filtros) {
  const modulos = await ModuloEnsino.findAll({
    include: [
      {
        model: AlunoModuloEnsino,
        as: 'matriculas',
        include: [{ model: NivelEnsino, as: 'nivelEnsino' }]
      }
    ],
    order: [['id_modulo_ensino', 'ASC']]
  });

  return modulos
    .filter(
      (modulo) =>
        !filtros.id_nivel_ensino ||
        modulo.matriculas.some(
          (matricula) => matricula.id_nivel_ensino === Number(filtros.id_nivel_ensino)
        )
    )
    .map((modulo) => ({
      id_modulo_ensino: modulo.id_modulo_ensino,
      nome: modulo.nome,
      niveis: niveisUnicos(modulo.matriculas),
      total_alunos: new Set(modulo.matriculas.map((matricula) => matricula.aluno_id_usuario))
        .size
    }));
}

async function buscarPorId(id_modulo_ensino, solicitante) {
  const modulo = await ModuloEnsino.findByPk(id_modulo_ensino, {
    include: [
      {
        model: AlunoModuloEnsino,
        as: 'matriculas',
        include: [
          { model: NivelEnsino, as: 'nivelEnsino' },
          {
            model: Aluno,
            as: 'aluno',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome'] }
            ]
          }
        ]
      }
    ]
  });

  if (!modulo) throw criarErro('Módulo não encontrado', 404);

  const matriculas =
    solicitante.tipo === 'aluno'
      ? modulo.matriculas.filter(
          (matricula) => matricula.aluno_id_usuario === solicitante.id_usuario
        )
      : modulo.matriculas;

  return {
    id_modulo_ensino: modulo.id_modulo_ensino,
    nome: modulo.nome,
    niveis: niveisUnicos(modulo.matriculas),
    alunos: matriculas.map((matricula) => formatarMatricula(matricula, true))
  };
}

async function criar(dados) {
  if (!dados.nome) throw criarErro('Campo obrigatório: nome');

  const existente = await ModuloEnsino.findOne({ where: { nome: dados.nome } });
  if (existente) throw criarErro('Já existe um módulo com esse nome', 409);

  const modulo = await ModuloEnsino.create({ nome: dados.nome });
  return { id_modulo_ensino: modulo.id_modulo_ensino, nome: modulo.nome };
}

async function atualizar(id_modulo_ensino, dados) {
  const modulo = await ModuloEnsino.findByPk(id_modulo_ensino);
  if (!modulo) throw criarErro('Módulo não encontrado', 404);

  if (dados.nome !== undefined) {
    if (!dados.nome) throw criarErro('Campo obrigatório: nome');
    const existente = await ModuloEnsino.findOne({ where: { nome: dados.nome } });
    if (existente && existente.id_modulo_ensino !== id_modulo_ensino) {
      throw criarErro('Já existe um módulo com esse nome', 409);
    }
    await modulo.update({ nome: dados.nome });
  }

  return { id_modulo_ensino: modulo.id_modulo_ensino, nome: modulo.nome };
}

async function associarAluno(id_modulo_ensino, dados) {
  if (!dados.id_aluno) throw criarErro('Campo obrigatório: id_aluno');
  if (!dados.id_nivel_ensino) throw criarErro('Campo obrigatório: id_nivel_ensino');

  const [modulo, aluno, nivel] = await Promise.all([
    ModuloEnsino.findByPk(id_modulo_ensino),
    Aluno.findByPk(dados.id_aluno),
    NivelEnsino.findByPk(dados.id_nivel_ensino)
  ]);

  if (!modulo) throw criarErro('Módulo não encontrado', 404);
  if (!aluno) throw criarErro('Aluno não encontrado', 404);
  if (!nivel) throw criarErro('Nível de ensino não encontrado', 404);

  const [matricula, criada] = await AlunoModuloEnsino.findOrCreate({
    where: {
      id_modulo_ensino,
      id_nivel_ensino: Number(dados.id_nivel_ensino),
      aluno_id_usuario: Number(dados.id_aluno)
    }
  });

  if (!criada) throw criarErro('Aluno já associado a este módulo e nível', 409);

  await matricula.reload({
    include: [
      { model: NivelEnsino, as: 'nivelEnsino' },
      {
        model: Aluno,
        as: 'aluno',
        include: [{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome'] }]
      }
    ]
  });

  return formatarMatricula(matricula, true);
}

async function meus(id_aluno) {
  const matriculas = await AlunoModuloEnsino.findAll({
    where: { aluno_id_usuario: id_aluno },
    include: [
      { model: ModuloEnsino, as: 'modulo' },
      { model: NivelEnsino, as: 'nivelEnsino' }
    ],
    order: [['id_modulo_ensino', 'ASC']]
  });

  return matriculas.map((matricula) => ({
    id_modulo_ensino: matricula.id_modulo_ensino,
    nome: matricula.modulo.nome,
    id_nivel_ensino: matricula.id_nivel_ensino,
    nivel_ensino: matricula.nivelEnsino
      ? {
          id_nivel_ensino: matricula.nivelEnsino.id_nivel_ensino,
          nome: matricula.nivelEnsino.nome
        }
      : null,
    status: matricula.status,
    data_conclusao: matricula.data_conclusao
  }));
}

async function atualizarProgresso(id_aluno, id_modulo_ensino, dados) {
  if (!dados.id_nivel_ensino) throw criarErro('Campo obrigatório: id_nivel_ensino');
  if (!STATUS.includes(dados.status)) throw criarErro('Status inválido');

  const matricula = await AlunoModuloEnsino.findOne({
    where: {
      id_modulo_ensino,
      id_nivel_ensino: Number(dados.id_nivel_ensino),
      aluno_id_usuario: id_aluno
    },
    include: [
      { model: ModuloEnsino, as: 'modulo' },
      { model: NivelEnsino, as: 'nivelEnsino' }
    ]
  });

  if (!matricula) throw criarErro('Matrícula no módulo não encontrada', 404);

  const dataConclusao =
    dados.status === 'concluido'
      ? matricula.data_conclusao || new Date()
      : null;

  await matricula.update({ status: dados.status, data_conclusao: dataConclusao });

  return {
    id_modulo_ensino: matricula.id_modulo_ensino,
    nome: matricula.modulo.nome,
    id_nivel_ensino: matricula.id_nivel_ensino,
    nivel_ensino: matricula.nivelEnsino
      ? {
          id_nivel_ensino: matricula.nivelEnsino.id_nivel_ensino,
          nome: matricula.nivelEnsino.nome
        }
      : null,
    status: matricula.status,
    data_conclusao: matricula.data_conclusao
  };
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  associarAluno,
  meus,
  atualizarProgresso
};
