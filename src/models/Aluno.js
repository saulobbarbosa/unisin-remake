const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define(
  'Aluno',
  {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    moedas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    vitorias_pvp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    id_nivel_ensino: { type: DataTypes.INTEGER, allowNull: true }
  },
  { tableName: 'aluno' }
);

module.exports = Aluno;
