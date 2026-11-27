const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrador = sequelize.define(
  'Administrador',
  {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true }
  },
  { tableName: 'administrador' }
);

module.exports = Administrador;
