const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resposta = sequelize.define(
  'Resposta',
  {
    id_resposta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    atividade_id_atividade: { type: DataTypes.INTEGER, allowNull: false },
    resposta: { type: DataTypes.TEXT, allowNull: false },
    validade: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ordem: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  },
  { tableName: 'resposta' }
);

module.exports = Resposta;
