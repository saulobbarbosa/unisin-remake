const Usuario = require('./Usuario');
const Administrador = require('./Administrador');
const Escola = require('./Escola');
const Professor = require('./Professor');
const Aluno = require('./Aluno');
const NivelEnsino = require('./NivelEnsino');
const Atividade = require('./Atividade');
const Resposta = require('./Resposta');
const Conteudo = require('./Conteudo');
const AlunoAtividade = require('./AlunoAtividade');
const ModuloEnsino = require('./ModuloEnsino');
const AlunoModuloEnsino = require('./AlunoModuloEnsino');
const ItemLoja = require('./ItemLoja');
const AlunoItemLoja = require('./AlunoItemLoja');
const Amigos = require('./Amigos');
const Conquista = require('./Conquista');
const AlunoConquista = require('./AlunoConquista');
const LogAuditoria = require('./LogAuditoria');

// Usuários e perfis
Usuario.hasOne(Aluno, { foreignKey: 'id_usuario', as: 'aluno' });
Aluno.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(Professor, { foreignKey: 'id_usuario', as: 'professor' });
Professor.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(Escola, { foreignKey: 'id_usuario', as: 'escola' });
Escola.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasOne(Administrador, { foreignKey: 'id_usuario', as: 'administrador' });
Administrador.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Escola.hasMany(Professor, { foreignKey: 'id_escola', as: 'professores' });
Professor.belongsTo(Escola, { foreignKey: 'id_escola', as: 'escola' });

Aluno.belongsTo(NivelEnsino, { foreignKey: 'id_nivel_ensino', as: 'nivelEnsino' });
NivelEnsino.hasMany(Aluno, { foreignKey: 'id_nivel_ensino', as: 'alunos' });

// Atividades
Atividade.belongsTo(NivelEnsino, { foreignKey: 'id_nivel_ensino', as: 'nivelEnsino' });
NivelEnsino.hasMany(Atividade, { foreignKey: 'id_nivel_ensino', as: 'atividades' });

Atividade.belongsTo(Professor, { foreignKey: 'id_professor', as: 'professor' });
Professor.hasMany(Atividade, { foreignKey: 'id_professor', as: 'atividades' });

Atividade.hasMany(Resposta, { foreignKey: 'atividade_id_atividade', as: 'alternativas' });
Resposta.belongsTo(Atividade, { foreignKey: 'atividade_id_atividade', as: 'atividade' });

Atividade.hasMany(Conteudo, { foreignKey: 'id_atividade', as: 'conteudos' });
Conteudo.belongsTo(Atividade, { foreignKey: 'id_atividade', as: 'atividade' });

Atividade.hasMany(AlunoAtividade, { foreignKey: 'id_atividade', as: 'conclusoes' });
AlunoAtividade.belongsTo(Atividade, { foreignKey: 'id_atividade', as: 'atividade' });

Aluno.hasMany(AlunoAtividade, { foreignKey: 'id_usuario', as: 'atividadesConcluidas' });
AlunoAtividade.belongsTo(Aluno, { foreignKey: 'id_usuario', as: 'aluno' });

// Módulos
AlunoModuloEnsino.belongsTo(ModuloEnsino, { foreignKey: 'id_modulo_ensino', as: 'modulo' });
ModuloEnsino.hasMany(AlunoModuloEnsino, { foreignKey: 'id_modulo_ensino', as: 'matriculas' });

AlunoModuloEnsino.belongsTo(NivelEnsino, { foreignKey: 'id_nivel_ensino', as: 'nivelEnsino' });
NivelEnsino.hasMany(AlunoModuloEnsino, { foreignKey: 'id_nivel_ensino', as: 'matriculas' });

AlunoModuloEnsino.belongsTo(Aluno, { foreignKey: 'aluno_id_usuario', as: 'aluno' });
Aluno.hasMany(AlunoModuloEnsino, { foreignKey: 'aluno_id_usuario', as: 'modulos' });

// Loja
AlunoItemLoja.belongsTo(Aluno, { foreignKey: 'aluno_id_usuario', as: 'aluno' });
Aluno.hasMany(AlunoItemLoja, { foreignKey: 'aluno_id_usuario', as: 'itens' });

AlunoItemLoja.belongsTo(ItemLoja, { foreignKey: 'item_loja_id_item_loja', as: 'item' });
ItemLoja.hasMany(AlunoItemLoja, { foreignKey: 'item_loja_id_item_loja', as: 'proprietarios' });

// Amigos
Amigos.belongsTo(Aluno, { foreignKey: 'aluno_id_usuario', as: 'aluno' });
Amigos.belongsTo(Aluno, { foreignKey: 'amigo_id_usuario', as: 'amigo' });
Aluno.hasMany(Amigos, { foreignKey: 'aluno_id_usuario', as: 'amizades' });

// Conquistas
AlunoConquista.belongsTo(Aluno, { foreignKey: 'aluno_id_usuario', as: 'aluno' });
AlunoConquista.belongsTo(Conquista, { foreignKey: 'conquista_id_conquista', as: 'conquista' });
Aluno.hasMany(AlunoConquista, { foreignKey: 'aluno_id_usuario', as: 'conquistas' });
Conquista.hasMany(AlunoConquista, { foreignKey: 'conquista_id_conquista', as: 'desbloqueios' });

module.exports = {
  sequelize: require('../config/database'),
  Usuario,
  Administrador,
  Escola,
  Professor,
  Aluno,
  NivelEnsino,
  Atividade,
  Resposta,
  Conteudo,
  AlunoAtividade,
  ModuloEnsino,
  AlunoModuloEnsino,
  ItemLoja,
  AlunoItemLoja,
  Amigos,
  Conquista,
  AlunoConquista,
  LogAuditoria
};
