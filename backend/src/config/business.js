require('dotenv').config();

function numero(nome, padrao) {
  const valor = Number(process.env[nome]);
  return Number.isFinite(valor) ? valor : padrao;
}

module.exports = {
  recompensas: {
    atividade: numero('RECOMPENSA_ATIVIDADE', 10),
    pvp: numero('RECOMPENSA_PVP', 20)
  },
  penalidades: {
    atividade: numero('PENALIDADE_ATIVIDADE', 15)
  },
  avaliacao: {
    quantidadeQuestoes: numero('AVALIACAO_QUANTIDADE_QUESTOES', 10),
    limiteNivel2: numero('AVALIACAO_LIMITE_NIVEL_2', 50),
    limiteNivel3: numero('AVALIACAO_LIMITE_NIVEL_3', 80)
  },
  pvp: {
    quantidadeQuestoes: numero('PVP_QUANTIDADE_QUESTOES', 5)
  }
};
