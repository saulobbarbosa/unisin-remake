const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Amigos = sequelize.define(
  'Amigos',
  {
    aluno_id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    amigo_id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    data_amizade: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { tableName: 'amigos' }
);

module.exports = Amigos;
