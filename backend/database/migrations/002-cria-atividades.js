const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('atividade', {
    id_atividade: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_nivel_ensino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'nivel_ensino', key: 'id_nivel_ensino' },
      onDelete: 'RESTRICT'
    },
    id_professor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'professor', key: 'id_usuario' },
      onDelete: 'RESTRICT'
    },
    nome_atividade: { type: DataTypes.STRING(120), allowNull: false },
    tipo: {
      type: DataTypes.ENUM('multipla_escolha', 'verdadeiro_falso'),
      allowNull: false,
      defaultValue: 'multipla_escolha'
    },
    pergunta: { type: DataTypes.TEXT, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });

  await queryInterface.createTable('resposta', {
    id_resposta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    atividade_id_atividade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'atividade', key: 'id_atividade' },
      onDelete: 'CASCADE'
    },
    resposta: { type: DataTypes.TEXT, allowNull: false },
    validade: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ordem: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  });

  await queryInterface.addIndex('resposta', ['atividade_id_atividade', 'ordem'], {
    unique: true,
    name: 'uk_resposta_ordem'
  });

  await queryInterface.createTable('conteudo', {
    id_conteudo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_atividade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'atividade', key: 'id_atividade' },
      onDelete: 'CASCADE'
    },
    tipo: { type: DataTypes.STRING(30), allowNull: true },
    caminho: { type: DataTypes.STRING(500), allowNull: false }
  });

  await queryInterface.createTable('aluno_has_atividade', {
    id_atividade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'atividade', key: 'id_atividade' },
      onDelete: 'RESTRICT'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'aluno', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    data_conclusao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('aluno_has_atividade');
  await queryInterface.dropTable('conteudo');
  await queryInterface.dropTable('resposta');
  await queryInterface.dropTable('atividade');
}

module.exports = { up, down };
