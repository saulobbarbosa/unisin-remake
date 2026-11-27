const { literal } = require('sequelize');
const {
  sequelize,
  Atividade,
  Resposta,
  Conteudo,
  NivelEnsino,
  Professor,
  Usuario,
  Aluno,
  AlunoAtividade
} = require('../models');
const config = require('../config/business');
const ConquistaService = require('./ConquistaService');
const { criarErro } = require('../utils/erro');
const { embaralhar } = require('../utils/sorteio');

const TIPOS = ['multipla_escolha', 'verdadeiro_falso'];

const incluir = [
  { model: NivelEnsino, as: 'nivelEnsino' },
  {
    model: Professor,
    as: 'professor',
    include: [{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome'] }]
  },
  { model: Resposta, as: 'alternativas' },
  { model: Conteudo, as: 'conteudos' }
];

function exigir(dados, campos) {
  for (const campo of campos) {
    if (dados[campo] === undefined || dados[campo] === null || dados[campo] === '') {
      throw criarErro(`Campo obrigatório: ${campo}`);
    }
  }
}

function validarTipo(tipo) {
  if (!TIPOS.includes(tipo)) throw criarErro('Tipo de atividade inválido');
}

function validarAlternativas(tipo, alternativas) {
  if (!Array.isArray(alternativas) || alternativas.length < 2) {
    throw criarErro('Informe ao menos duas alternativas');
  }
  if (tipo === 'verdadeiro_falso' && alternativas.length !== 2) {
    throw criarErro('Atividade de verdadeiro ou falso deve ter duas alternativas');
  }

  for (const alternativa of alternativas) {
    if (!alternativa.resposta) throw criarErro('Toda alternativa precisa de uma resposta');
  }

  const corretas = alternativas.filter((alternativa) => Boolean(alternativa.validade));
  if (corretas.length !== 1) {
    throw criarErro('A atividade deve possuir exatamente uma alternativa correta');
  }
}

function formatar(atividade, revelarResposta) {
  const dados = typeof atividade.get === 'function' ? atividade.get({ plain: true }) : atividade;
  const alternativas = (dados.alternativas || [])
    .sort((a, b) => a.ordem - b.ordem)
    .map((alternativa) => {
      const item = {
        id_resposta: alternativa.id_resposta,
        resposta: alternativa.resposta,
        ordem: alternativa.ordem
      };
      if (revelarResposta) item.validade = Boolean(alternativa.validade);
      return item;
    });

  return {
    id_atividade: dados.id_atividade,
    nome_atividade: dados.nome_atividade,
    pergunta: dados.pergunta,
    tipo: dados.tipo,
    ativo: Boolean(dados.ativo),
    data_criacao: dados.data_criacao,
    id_nivel_ensino: dados.id_nivel_ensino,
    nivel_ensino: dados.nivelEnsino
      ? { id_nivel_ensino: dados.nivelEnsino.id_nivel_ensino, nome: dados.nivelEnsino.nome }
      : null,
    id_professor: dados.id_professor,
    professor:
      dados.professor && dados.professor.usuario
        ? {
            id_usuario: dados.professor.usuario.id_usuario,
            nome: dados.professor.usuario.nome
          }
        : null,
    alternativas,
    conteudos: (dados.conteudos || []).map((conteudo) => ({
      id_conteudo: conteudo.id_conteudo,
      tipo: conteudo.tipo,
      caminho: conteudo.caminho
    }))
  };
}

async function criar(id_professor, dados) {
  exigir(dados, ['nome_atividade', 'pergunta', 'id_nivel_ensino']);

  const tipo = dados.tipo || 'multipla_escolha';
  validarTipo(tipo);
  validarAlternativas(tipo, dados.alternativas);

  const nivel = await NivelEnsino.findByPk(dados.id_nivel_ensino);
  if (!nivel) throw criarErro('Nível de ensino não encontrado', 404);

  const atividade = await sequelize.transaction(async (transaction) => {
    const nova = await Atividade.create(
      {
        id_nivel_ensino: dados.id_nivel_ensino,
        id_professor,
        nome_atividade: dados.nome_atividade,
        tipo,
        pergunta: dados.pergunta,
        ativo: dados.ativo === undefined ? true : Boolean(dados.ativo)
      },
      { transaction }
    );

    await Resposta.bulkCreate(
      dados.alternativas.map((alternativa, indice) => ({
        atividade_id_atividade: nova.id_atividade,
        resposta: alternativa.resposta,
        validade: Boolean(alternativa.validade),
        ordem: indice + 1
      })),
      { transaction }
    );

    if (Array.isArray(dados.conteudos) && dados.conteudos.length > 0) {
      await Conteudo.bulkCreate(
        dados.conteudos.map((conteudo) => ({
          id_atividade: nova.id_atividade,
          tipo: conteudo.tipo,
          caminho: conteudo.caminho
        })),
        { transaction }
      );
    }

    return nova;
  });

  return buscarPorId(atividade.id_atividade, { tipo: 'professor' });
}

async function listar(filtros, solicitante) {
  const where = {};
  if (filtros.id_nivel_ensino) where.id_nivel_ensino = Number(filtros.id_nivel_ensino);
  if (filtros.id_professor) where.id_professor = Number(filtros.id_professor);

  if (solicitante.tipo === 'aluno') {
    where.ativo = true;
  } else if (filtros.ativo !== undefined) {
    where.ativo = filtros.ativo === true || filtros.ativo === 'true';
  }

  const atividades = await Atividade.findAll({
    where,
    include: incluir,
    order: [['id_atividade', 'ASC']]
  });

  return atividades.map((atividade) =>
    formatar(atividade, solicitante.tipo !== 'aluno')
  );
}

async function buscarPorId(id_atividade, solicitante) {
  const atividade = await Atividade.findByPk(id_atividade, { include: incluir });
  if (!atividade) throw criarErro('Atividade não encontrada', 404);
  if (solicitante.tipo === 'aluno' && !atividade.ativo) {
    throw criarErro('Atividade não encontrada', 404);
  }

  return formatar(atividade, solicitante.tipo !== 'aluno');
}

async function atualizar(id_atividade, id_professor, dados) {
  const atividade = await Atividade.findByPk(id_atividade, {
    include: [{ model: Resposta, as: 'alternativas' }]
  });

  if (!atividade) throw criarErro('Atividade não encontrada', 404);
  if (atividade.id_professor !== id_professor) {
    throw criarErro('Professor só pode alterar as próprias atividades', 403);
  }

  const tipo = dados.tipo || atividade.tipo;
  validarTipo(tipo);

  if (dados.alternativas) {
    validarAlternativas(tipo, dados.alternativas);
  } else {
    validarAlternativas(
      tipo,
      atividade.alternativas.map((alternativa) => alternativa.get({ plain: true }))
    );
  }

  if (dados.id_nivel_ensino) {
    const nivel = await NivelEnsino.findByPk(dados.id_nivel_ensino);
    if (!nivel) throw criarErro('Nível de ensino não encontrado', 404);
  }

  await sequelize.transaction(async (transaction) => {
    const alteracoes = {};
    for (const campo of ['nome_atividade', 'pergunta', 'id_nivel_ensino', 'tipo']) {
      if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
    }
    if (Object.keys(alteracoes).length > 0) {
      await atividade.update(alteracoes, { transaction });
    }

    if (dados.alternativas) {
      await Resposta.destroy({
        where: { atividade_id_atividade: id_atividade },
        transaction
      });
      await Resposta.bulkCreate(
        dados.alternativas.map((alternativa, indice) => ({
          atividade_id_atividade: id_atividade,
          resposta: alternativa.resposta,
          validade: Boolean(alternativa.validade),
          ordem: indice + 1
        })),
        { transaction }
      );
    }

    if (dados.conteudos !== undefined) {
      await Conteudo.destroy({
        where: { id_atividade },
        transaction
      });
      if (dados.conteudos.length > 0) {
        await Conteudo.bulkCreate(
          dados.conteudos.map((conteudo) => ({
            id_atividade,
            tipo: conteudo.tipo,
            caminho: conteudo.caminho
          })),
          { transaction }
        );
      }
    }
  });

  return buscarPorId(id_atividade, { tipo: 'professor' });
}

async function alterarStatus(id_atividade, id_professor, ativo) {
  if (ativo === undefined || ativo === null) {
    throw criarErro('Campo obrigatório: ativo');
  }

  const atividade = await Atividade.findByPk(id_atividade);
  if (!atividade) throw criarErro('Atividade não encontrada', 404);
  if (atividade.id_professor !== id_professor) {
    throw criarErro('Professor só pode alterar as próprias atividades', 403);
  }

  await atividade.update({ ativo: Boolean(ativo) });
  return buscarPorId(id_atividade, { tipo: 'professor' });
}

async function responder(id_aluno, id_atividade, id_resposta) {
  if (!id_resposta) throw criarErro('Campo obrigatório: id_resposta');

  return sequelize.transaction(async (transaction) => {
    const atividade = await Atividade.findByPk(id_atividade, { transaction });
    if (!atividade) throw criarErro('Atividade não encontrada', 404);
    if (!atividade.ativo) throw criarErro('Atividade inativa', 400);

    const jaConcluida = await AlunoAtividade.findOne({
      where: { id_atividade, id_usuario: id_aluno },
      transaction
    });
    if (jaConcluida) throw criarErro('Atividade já concluída', 409);

    const alternativa = await Resposta.findOne({
      where: { id_resposta, atividade_id_atividade: id_atividade },
      transaction
    });
    if (!alternativa) throw criarErro('Alternativa inválida');

    const aluno = await Aluno.findByPk(id_aluno, { transaction });
    if (!aluno) throw criarErro('Aluno não encontrado', 404);

    const correta = Boolean(alternativa.validade);

    if (correta) {
      await AlunoAtividade.create(
        { id_atividade, id_usuario: id_aluno },
        { transaction }
      );
      await Aluno.increment(
        { moedas: config.recompensas.atividade },
        { where: { id_usuario: id_aluno }, transaction }
      );
    } else {
      const penalidade = config.penalidades.atividade;
      await Aluno.update(
        {
          moedas: literal(
            `CASE WHEN moedas >= ${penalidade} THEN moedas - ${penalidade} ELSE 0 END`
          )
        },
        { where: { id_usuario: id_aluno }, transaction }
      );
    }

    const alunoAtualizado = await Aluno.findByPk(id_aluno, { transaction });
    const desbloqueadas = await ConquistaService.verificarConquistas(
      id_aluno,
      transaction
    );

    return {
      correta,
      moedas: alunoAtualizado.moedas,
      recompensa: correta ? config.recompensas.atividade : 0,
      penalidade: correta ? 0 : config.penalidades.atividade,
      conquistas: desbloqueadas.map((conquista) => ({
        id_conquista: conquista.id_conquista,
        nome_conquista: conquista.nome_conquista
      }))
    };
  });
}

async function concluidas(id_aluno) {
  const conclusoes = await AlunoAtividade.findAll({
    where: { id_usuario: id_aluno },
    include: [
      {
        model: Atividade,
        as: 'atividade',
        include: [
          { model: NivelEnsino, as: 'nivelEnsino' },
          {
            model: Professor,
            as: 'professor',
            include: [{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nome'] }]
          }
        ]
      }
    ],
    order: [['data_conclusao', 'DESC']]
  });

  return conclusoes.map((conclusao) => ({
    id_atividade: conclusao.id_atividade,
    nome_atividade: conclusao.atividade.nome_atividade,
    pergunta: conclusao.atividade.pergunta,
    nivel_ensino: conclusao.atividade.nivelEnsino
      ? {
          id_nivel_ensino: conclusao.atividade.nivelEnsino.id_nivel_ensino,
          nome: conclusao.atividade.nivelEnsino.nome
        }
      : null,
    data_conclusao: conclusao.data_conclusao
  }));
}

async function sortearAtivas(quantidade) {  const ativas = await Atividade.findAll({
    where: { ativo: true },
    attributes: ['id_atividade']
  });

  const ids = embaralhar(ativas.map((atividade) => atividade.id_atividade)).slice(
    0,
    quantidade
  );
  if (ids.length === 0) return [];

  const atividades = await Atividade.findAll({
    where: { id_atividade: ids },
    include: incluir
  });

  const porId = new Map(atividades.map((atividade) => [atividade.id_atividade, atividade]));
  return ids.map((id) => porId.get(id)).filter(Boolean);
}

function paraAluno(atividade) {
  return formatar(atividade, false);
}

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  alterarStatus,
  responder,
  concluidas,
  sortearAtivas,
  paraAluno
};
