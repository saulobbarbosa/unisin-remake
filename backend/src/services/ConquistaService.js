const {
  Conquista,
  AlunoConquista,
  AlunoAtividade,
  AlunoItemLoja,
  Aluno
} = require('../models');
const NivelService = require('./NivelService');
const { criarErro } = require('../utils/erro');

const TIPOS_REQUISITO = [
  'atividades_concluidas',
  'vitorias_pvp',
  'itens_comprados',
  'nivel_ensino'
];

function formatar(conquista) {
  return {
    id_conquista: conquista.id_conquista,
    nome_conquista: conquista.nome_conquista,
    descricao: conquista.descricao,
    imagem: conquista.imagem,
    tipo_requisito: conquista.tipo_requisito,
    valor_requisito: conquista.valor_requisito,
    ativa: Boolean(conquista.ativa)
  };
}

function validar(dados, parcial = false) {
  if (!parcial || dados.nome_conquista !== undefined) {
    if (!dados.nome_conquista) throw criarErro('Campo obrigatório: nome_conquista');
  }
  if (!parcial || dados.tipo_requisito !== undefined) {
    if (!TIPOS_REQUISITO.includes(dados.tipo_requisito)) {
      throw criarErro('Tipo de requisito inválido');
    }
  }
  if (!parcial || dados.valor_requisito !== undefined) {
    const valor = Number(dados.valor_requisito);
    if (!Number.isInteger(valor) || valor < 1) {
      throw criarErro('Valor do requisito deve ser um inteiro maior que zero');
    }
  }
}

async function listar(solicitante) {
  const where = solicitante.tipo === 'administrador' ? {} : { ativa: true };
  const conquistas = await Conquista.findAll({
    where,
    order: [['id_conquista', 'ASC']]
  });
  return conquistas.map(formatar);
}

async function minhas(id_aluno) {
  const registros = await AlunoConquista.findAll({
    where: { aluno_id_usuario: id_aluno },
    include: [{ model: Conquista, as: 'conquista' }],
    order: [['data_desbloqueio', 'DESC']]
  });

  return registros.map((registro) => ({
    ...formatar(registro.conquista),
    data_desbloqueio: registro.data_desbloqueio
  }));
}

async function criar(dados) {
  validar(dados);

  const existente = await Conquista.findOne({
    where: { nome_conquista: dados.nome_conquista }
  });
  if (existente) throw criarErro('Já existe uma conquista com esse nome', 409);

  const conquista = await Conquista.create({
    nome_conquista: dados.nome_conquista,
    descricao: dados.descricao,
    imagem: dados.imagem,
    tipo_requisito: dados.tipo_requisito,
    valor_requisito: Number(dados.valor_requisito),
    ativa: dados.ativa === undefined ? true : Boolean(dados.ativa)
  });

  return formatar(conquista);
}

async function atualizar(id_conquista, dados) {
  const conquista = await Conquista.findByPk(id_conquista);
  if (!conquista) throw criarErro('Conquista não encontrada', 404);

  validar(dados, true);

  const alteracoes = {};
  for (const campo of [
    'nome_conquista',
    'descricao',
    'imagem',
    'tipo_requisito',
    'valor_requisito'
  ]) {
    if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
  }

  await conquista.update(alteracoes);
  return formatar(conquista);
}

async function alterarStatus(id_conquista, ativa) {
  if (ativa === undefined || ativa === null) {
    throw criarErro('Campo obrigatório: ativa');
  }

  const conquista = await Conquista.findByPk(id_conquista);
  if (!conquista) throw criarErro('Conquista não encontrada', 404);

  await conquista.update({ ativa: Boolean(ativa) });
  return formatar(conquista);
}

async function verificarConquistas(id_aluno, transaction) {
  const aluno = await Aluno.findByPk(id_aluno, { transaction });
  if (!aluno) return [];

  const conquistas = await Conquista.findAll({ where: { ativa: true }, transaction });
  if (conquistas.length === 0) return [];

  const [atividadesConcluidas, itensComprados] = await Promise.all([
    AlunoAtividade.count({ where: { id_usuario: id_aluno }, transaction }),
    AlunoItemLoja.count({ where: { aluno_id_usuario: id_aluno }, transaction })
  ]);

  const valores = {
    atividades_concluidas: atividadesConcluidas,
    vitorias_pvp: aluno.vitorias_pvp,
    itens_comprados: itensComprados,
    nivel_ensino: await NivelService.nivelMedio(id_aluno, transaction)
  };

  const desbloqueadas = [];

  for (const conquista of conquistas) {
    if (valores[conquista.tipo_requisito] < conquista.valor_requisito) continue;

    const [, criada] = await AlunoConquista.findOrCreate({
      where: {
        aluno_id_usuario: id_aluno,
        conquista_id_conquista: conquista.id_conquista
      },
      transaction
    });

    if (criada) desbloqueadas.push(conquista);
  }

  return desbloqueadas;
}

module.exports = {
  listar,
  minhas,
  criar,
  atualizar,
  alterarStatus,
  verificarConquistas
};
