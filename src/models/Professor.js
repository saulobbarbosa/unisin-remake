const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professor = sequelize.define(
  'Professor',
  {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    id_escola: { type: DataTypes.INTEGER, allowNull: false }
  },
  { tableName: 'professor' }
);

module.exports = Professor;
