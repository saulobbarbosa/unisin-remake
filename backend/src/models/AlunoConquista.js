const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlunoConquista = sequelize.define(
  'AlunoConquista',
  {
    aluno_id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    conquista_id_conquista: { type: DataTypes.INTEGER, primaryKey: true },
    data_desbloqueio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { tableName: 'aluno_has_conquista' }
);

module.exports = AlunoConquista;
