const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, Usuario, Aluno } = require('../models');
const AtividadeService = require('./AtividadeService');
const AmizadeService = require('./AmizadeService');
const ConquistaService = require('./ConquistaService');
const config = require('../config/business');
const { criarErro } = require('../utils/erro');
const { emitirParaAluno } = require('../realtime');

const convites = new Map();
const partidas = new Map();
const partidaDoAluno = new Map();

function partidaAtiva(id_aluno) {
  const id_partida = partidaDoAluno.get(id_aluno);
  if (!id_partida) return null;
  const partida = partidas.get(id_partida);
  if (!partida || partida.finalizada) return null;
  return partida;
}

function visao(partida) {
  const questao = partida.finalizada ? null : partida.questoes[partida.indice];

  return {
    id_partida: partida.id_partida,
    jogadores: partida.jogadores.map((jogador) => ({
      id_usuario: jogador.id_usuario,
      nome: jogador.nome,
      pontos: partida.pontos[jogador.id_usuario]
    })),
    indice: partida.indice,
    total: partida.questoes.length,
    questaoAtual: questao ? AtividadeService.paraAluno(questao) : null,
    finalizada: partida.finalizada,
    resultado: partida.resultado
  };
}

async function nomesDosJogadores(ids) {
  const usuarios = await Usuario.findAll({
    where: { id_usuario: { [Op.in]: ids } },
    attributes: ['id_usuario', 'nome']
  });
  return new Map(usuarios.map((usuario) => [usuario.id_usuario, usuario.nome]));
}

async function criarConvite(id_aluno, id_amigo) {
  if (!id_amigo) throw criarErro('Campo obrigatório: id_amigo');
  id_amigo = Number(id_amigo);

  if (id_amigo === id_aluno) throw criarErro('Não é possível convidar a si mesmo');

  if (!(await AmizadeService.saoAmigos(id_aluno, id_amigo))) {
    throw criarErro('Só é possível convidar um amigo');
  }

  if (partidaAtiva(id_aluno)) throw criarErro('Você já está em uma partida', 409);
  if (partidaAtiva(id_amigo)) throw criarErro('O adversário já está em uma partida', 409);

  for (const convite of convites.values()) {
    if (
      convite.status === 'pendente' &&
      ((convite.id_desafiante === id_aluno && convite.id_desafiado === id_amigo) ||
        (convite.id_desafiante === id_amigo && convite.id_desafiado === id_aluno))
    ) {
      throw criarErro('Já existe um convite pendente entre os jogadores', 409);
    }
  }

  const nome = (await nomesDosJogadores([id_aluno])).get(id_aluno) || 'Aluno';
  const convite = {
    id_convite: crypto.randomUUID(),
    id_desafiante: id_aluno,
    id_desafiado: id_amigo,
    status: 'pendente',
    criado_em: new Date()
  };

  convites.set(convite.id_convite, convite);

  const resposta = { ...convite, desafiante: { id_usuario: id_aluno, nome } };
  emitirParaAluno(id_amigo, 'pvp:convite', resposta);

  return resposta;
}

async function aceitarConvite(id_aluno, id_convite) {
  const convite = convites.get(id_convite);
  if (!convite) throw criarErro('Convite não encontrado', 404);
  if (convite.id_desafiado !== id_aluno) {
    throw criarErro('Convite não pertence a este aluno', 403);
  }
  if (convite.status !== 'pendente') throw criarErro('Convite já respondido');

  if (partidaAtiva(convite.id_desafiante)) {
    throw criarErro('O desafiante já está em uma partida', 409);
  }
  if (partidaAtiva(id_aluno)) throw criarErro('Você já está em uma partida', 409);

  const atividades = await AtividadeService.sortearAtivas(
    config.pvp.quantidadeQuestoes
  );
  if (atividades.length === 0) {
    throw criarErro('Nenhuma atividade disponível para a partida', 400);
  }

  const jogadores = [convite.id_desafiante, convite.id_desafiado];
  const nomes = await nomesDosJogadores(jogadores);

  for (const id of jogadores) {
    const antiga = partidaDoAluno.get(id);
    if (antiga) partidas.delete(antiga);
  }

  const partida = {
    id_partida: crypto.randomUUID(),
    jogadores: jogadores.map((id) => ({
      id_usuario: id,
      nome: nomes.get(id) || 'Aluno'
    })),
    questoes: atividades.map((atividade) => atividade.get({ plain: true })),
    indice: 0,
    pontos: { [jogadores[0]]: 0, [jogadores[1]]: 0 },
    respostas: {},
    finalizada: false,
    resultado: null
  };

  partidas.set(partida.id_partida, partida);
  for (const id of jogadores) partidaDoAluno.set(id, partida.id_partida);

  convites.delete(id_convite);

  const partidaIniciada = visao(partida);
  for (const id of jogadores) {
    emitirParaAluno(id, 'pvp:partida_iniciada', partidaIniciada);
  }

  return partidaIniciada;
}

function recusarConvite(id_aluno, id_convite) {
  const convite = convites.get(id_convite);
  if (!convite) throw criarErro('Convite não encontrado', 404);
  if (convite.id_desafiado !== id_aluno) {
    throw criarErro('Convite não pertence a este aluno', 403);
  }

  convites.delete(id_convite);
  emitirParaAluno(convite.id_desafiante, 'pvp:convite_recusado', {
    id_convite,
    id_desafiado: id_aluno
  });

  return { resposta: 'Convite recusado' };
}

function partidaAtual(id_aluno) {
  const id_partida = partidaDoAluno.get(id_aluno);
  if (!id_partida) return null;
  const partida = partidas.get(id_partida);
  if (!partida) return null;
  return visao(partida);
}

async function finalizarPartida(partida) {
  const [jogadorA, jogadorB] = partida.jogadores.map((jogador) => jogador.id_usuario);
  const pontosA = partida.pontos[jogadorA];
  const pontosB = partida.pontos[jogadorB];

  let vencedor = null;
  if (pontosA > pontosB) vencedor = jogadorA;
  if (pontosB > pontosA) vencedor = jogadorB;

  let recompensa = 0;
  let conquistas = [];

  if (vencedor) {
    const desbloqueadas = await sequelize.transaction(async (transaction) => {
      await Aluno.increment(
        { moedas: config.recompensas.pvp, vitorias_pvp: 1 },
        { where: { id_usuario: vencedor }, transaction }
      );
      return ConquistaService.verificarConquistas(vencedor, transaction);
    });

    recompensa = config.recompensas.pvp;
    conquistas = desbloqueadas.map((conquista) => ({
      id_conquista: conquista.id_conquista,
      nome_conquista: conquista.nome_conquista
    }));
  }

  partida.finalizada = true;
  partida.resultado = {
    id_partida: partida.id_partida,
    vencedor,
    empate: vencedor === null,
    pontos: { [jogadorA]: pontosA, [jogadorB]: pontosB },
    recompensa,
    conquistas
  };

  for (const jogador of partida.jogadores) {
    emitirParaAluno(jogador.id_usuario, 'pvp:resultado', partida.resultado);
  }

  return partida.resultado;
}

async function responder(id_aluno, dados) {
  const { id_partida, id_atividade, id_resposta } = dados || {};

  const partida = partidas.get(id_partida);
  if (!partida) throw criarErro('Partida não encontrada', 404);
  if (partida.finalizada) throw criarErro('Partida já finalizada');
  if (!partida.jogadores.some((jogador) => jogador.id_usuario === id_aluno)) {
    throw criarErro('Aluno não participa da partida', 403);
  }

  const questao = partida.questoes[partida.indice];
  if (!questao || questao.id_atividade !== Number(id_atividade)) {
    throw criarErro('Questão não é a atual da partida');
  }

  if (!partida.respostas[questao.id_atividade]) {
    partida.respostas[questao.id_atividade] = {};
  }
  const respostasQuestao = partida.respostas[questao.id_atividade];

  if (respostasQuestao[id_aluno]) {
    throw criarErro('Você já respondeu esta questão', 409);
  }

  const alternativa = (questao.alternativas || []).find(
    (item) => item.id_resposta === Number(id_resposta)
  );
  if (!alternativa) throw criarErro('Alternativa inválida');

  respostasQuestao[id_aluno] = {
    id_resposta: alternativa.id_resposta,
    correta: Boolean(alternativa.validade)
  };
  if (alternativa.validade) partida.pontos[id_aluno] += 1;

  for (const jogador of partida.jogadores) {
    if (jogador.id_usuario === id_aluno) continue;
    emitirParaAluno(jogador.id_usuario, 'pvp:resposta_registrada', {
      id_partida: partida.id_partida,
      id_atividade: questao.id_atividade,
      id_usuario: id_aluno
    });
  }

  if (Object.keys(respostasQuestao).length < partida.jogadores.length) {
    return { aguardando: true };
  }

  if (partida.indice < partida.questoes.length - 1) {
    partida.indice += 1;
    const proxima = visao(partida);
    for (const jogador of partida.jogadores) {
      emitirParaAluno(jogador.id_usuario, 'pvp:pergunta', proxima);
    }
    return { proxima: true };
  }

  const resultado = await finalizarPartida(partida);
  return { resultado };
}

async function vitorias(id_aluno) {
  const aluno = await Aluno.findByPk(id_aluno);
  if (!aluno) throw criarErro('Aluno não encontrado', 404);
  return { vitorias_pvp: aluno.vitorias_pvp };
}

module.exports = {
  criarConvite,
  aceitarConvite,
  recusarConvite,
  partidaAtual,
  responder,
  vitorias
};
