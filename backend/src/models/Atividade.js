const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Atividade = sequelize.define(
  'Atividade',
  {
    id_atividade: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_nivel_ensino: { type: DataTypes.INTEGER, allowNull: false },
    id_professor: { type: DataTypes.INTEGER, allowNull: false },
    nome_atividade: { type: DataTypes.STRING(120), allowNull: false },
    tipo: {
      type: DataTypes.ENUM('multipla_escolha', 'verdadeiro_falso'),
      allowNull: false,
      defaultValue: 'multipla_escolha'
    },
    pergunta: { type: DataTypes.TEXT, allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    data_criacao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { tableName: 'atividade' }
);

module.exports = Atividade;
