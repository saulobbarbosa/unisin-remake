const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conquista = sequelize.define(
  'Conquista',
  {
    id_conquista: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_conquista: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    imagem: { type: DataTypes.STRING(500), allowNull: true },
    tipo_requisito: {
      type: DataTypes.ENUM(
        'atividades_concluidas',
        'vitorias_pvp',
        'itens_comprados',
        'nivel_ensino'
      ),
      allowNull: false
    },
    valor_requisito: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    ativa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { tableName: 'conquista' }
);

module.exports = Conquista;
