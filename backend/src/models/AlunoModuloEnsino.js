const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlunoModuloEnsino = sequelize.define(
  'AlunoModuloEnsino',
  {
    id_modulo_ensino: { type: DataTypes.INTEGER, primaryKey: true },
    id_nivel_ensino: { type: DataTypes.INTEGER, primaryKey: true },
    aluno_id_usuario: { type: DataTypes.INTEGER, primaryKey: true },
    status: {
      type: DataTypes.ENUM('nao_iniciado', 'em_andamento', 'concluido'),
      allowNull: false,
      defaultValue: 'nao_iniciado'
    },
    data_conclusao: { type: DataTypes.DATE, allowNull: true }
  },
  { tableName: 'aluno_has_modulo_ensino' }
);

module.exports = AlunoModuloEnsino;
