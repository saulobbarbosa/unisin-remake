const {
  Usuario,
  Aluno,
  Escola,
  Professor,
  Administrador,
  NivelEnsino
} = require('../models');
const { criarErro } = require('../utils/erro');

function tipoDoPerfil(perfil) {
  if (perfil.administrador) return 'administrador';
  if (perfil.escola) return 'escola';
  if (perfil.professor) return 'professor';
  if (perfil.aluno) return 'aluno';
  return null;
}

async function buscarMe(id_usuario) {
  const usuario = await Usuario.findByPk(id_usuario, {
    include: [
      {
        model: Aluno,
        as: 'aluno',
        include: [{ model: NivelEnsino, as: 'nivelEnsino' }]
      },
      {
        model: Professor,
        as: 'professor',
        include: [{ model: Escola, as: 'escola' }]
      },
      { model: Escola, as: 'escola' },
      { model: Administrador, as: 'administrador' }
    ]
  });

  if (!usuario) throw criarErro('Usuário não encontrado', 404);

  const perfil = usuario.get({ plain: true });
  const resposta = {
    id_usuario: perfil.id_usuario,
    nome: perfil.nome,
    email: perfil.email,
    dt_nasc: perfil.dt_nasc,
    tipo: tipoDoPerfil(perfil)
  };

  if (perfil.aluno) {
    resposta.moedas = perfil.aluno.moedas;
    resposta.vitorias_pvp = perfil.aluno.vitorias_pvp;
    resposta.nivel_ensino = perfil.aluno.nivelEnsino
      ? {
          id_nivel_ensino: perfil.aluno.nivelEnsino.id_nivel_ensino,
          nome: perfil.aluno.nivelEnsino.nome
        }
      : null;
  }

  if (perfil.professor) {
    resposta.id_escola = perfil.professor.id_escola;
    resposta.escola = perfil.professor.escola
      ? { id_escola: perfil.professor.escola.id_escola, nome: perfil.professor.escola.nome }
      : null;
  }

  if (perfil.escola) {
    resposta.id_escola = perfil.escola.id_escola;
    resposta.escola = {
      id_escola: perfil.escola.id_escola,
      nome: perfil.escola.nome,
      cep: perfil.escola.cep,
      rua: perfil.escola.rua,
      estado: perfil.escola.estado,
      cidade: perfil.escola.cidade,
      numero: perfil.escola.numero
    };
  }

  return resposta;
}

module.exports = { buscarMe };
