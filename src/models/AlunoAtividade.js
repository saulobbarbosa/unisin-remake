const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlunoAtividade = sequelize.define(
  'AlunoAtividade',
  {
    id_atividade: { type: DataTypes.INTEGER, primaryKey: true },
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    data_conclusao: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { tableName: 'aluno_has_atividade' }
);

module.exports = AlunoAtividade;
