const {
  sequelize,
  Aluno,
  Resposta,
  NivelEnsino
} = require('../models');
const AtividadeService = require('./AtividadeService');
const ConquistaService = require('./ConquistaService');
const config = require('../config/business');
const { criarErro } = require('../utils/erro');

const avaliacoesEmAndamento = new Map();

async function iniciar(id_aluno) {
  const aluno = await Aluno.findByPk(id_aluno);
  if (!aluno) throw criarErro('Aluno não encontrado', 404);

  const atividades = await AtividadeService.sortearAtivas(
    config.avaliacao.quantidadeQuestoes
  );

  if (atividades.length === 0) {
    throw criarErro('Nenhuma atividade disponível para avaliação', 400);
  }

  avaliacoesEmAndamento.set(id_aluno, {
    questoes: atividades.map((atividade) => atividade.id_atividade),
    iniciadaEm: new Date()
  });

  return {
    quantidade: atividades.length,
    questoes: atividades.map((atividade) => AtividadeService.paraAluno(atividade))
  };
}

function calcularPercentual(acertos, total) {
  if (total === 0) return 0;
  return Math.round((acertos / total) * 100);
}

function escolherNivel(percentual, niveis) {
  if (niveis.length === 0) throw criarErro('Nenhum nível de ensino cadastrado', 400);

  let indice = 0;
  if (percentual >= config.avaliacao.limiteNivel3) {
    indice = 2;
  } else if (percentual >= config.avaliacao.limiteNivel2) {
    indice = 1;
  }

  return niveis[Math.min(indice, niveis.length - 1)];
}

async function finalizar(id_aluno, respostas) {
  const avaliacao = avaliacoesEmAndamento.get(id_aluno);
  if (!avaliacao) throw criarErro('Nenhuma avaliação em andamento', 400);
  if (!Array.isArray(respostas)) throw criarErro('Campo respostas deve ser uma lista');

  const alternativas = await Resposta.findAll({
    where: { atividade_id_atividade: avaliacao.questoes }
  });

  const respostaPorAtividade = new Map();
  for (const resposta of respostas) {
    respostaPorAtividade.set(Number(resposta.id_atividade), Number(resposta.id_resposta));
  }

  let acertos = 0;
  for (const id_atividade of avaliacao.questoes) {
    const id_resposta = respostaPorAtividade.get(id_atividade);
    if (!id_resposta) continue;

    const alternativa = alternativas.find(
      (item) =>
        item.id_resposta === id_resposta && item.atividade_id_atividade === id_atividade
    );

    if (alternativa && alternativa.validade) acertos += 1;
  }

  const total = avaliacao.questoes.length;
  const percentual = calcularPercentual(acertos, total);
  const niveis = await NivelEnsino.findAll({ order: [['id_nivel_ensino', 'ASC']] });
  const nivel = escolherNivel(percentual, niveis);

  const desbloqueadas = await sequelize.transaction(async (transaction) => {
    await Aluno.update(
      { id_nivel_ensino: nivel.id_nivel_ensino },
      { where: { id_usuario: id_aluno }, transaction }
    );

    return ConquistaService.verificarConquistas(id_aluno, transaction);
  });

  avaliacoesEmAndamento.delete(id_aluno);

  return {
    acertos,
    total,
    percentual,
    nivel: { id_nivel_ensino: nivel.id_nivel_ensino, nome: nivel.nome },
    conquistas: desbloqueadas.map((conquista) => ({
      id_conquista: conquista.id_conquista,
      nome_conquista: conquista.nome_conquista
    }))
  };
}

module.exports = { iniciar, finalizar };
