const { DataTypes } = require('sequelize');

async function up(queryInterface) {
  await queryInterface.createTable('usuario', {
    id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    dt_nasc: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(255), allowNull: false }
  });

  await queryInterface.createTable('administrador', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'usuario', key: 'id_usuario' },
      onDelete: 'CASCADE'
    }
  });

  await queryInterface.createTable('escola', {
    id_escola: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'usuario', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    cep: { type: DataTypes.STRING(9), allowNull: true },
    rua: { type: DataTypes.STRING(120), allowNull: true },
    estado: { type: DataTypes.STRING(50), allowNull: true },
    cidade: { type: DataTypes.STRING(80), allowNull: true },
    numero: { type: DataTypes.STRING(15), allowNull: true }
  });

  await queryInterface.createTable('nivel_ensino', {
    id_nivel_ensino: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(60), allowNull: false, unique: true }
  });

  await queryInterface.createTable('aluno', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'usuario', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    moedas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    vitorias_pvp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    id_nivel_ensino: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'nivel_ensino', key: 'id_nivel_ensino' },
      onDelete: 'SET NULL'
    }
  });

  await queryInterface.createTable('professor', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'usuario', key: 'id_usuario' },
      onDelete: 'CASCADE'
    },
    id_escola: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'escola', key: 'id_escola' },
      onDelete: 'CASCADE'
    }
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable('professor');
  await queryInterface.dropTable('aluno');
  await queryInterface.dropTable('nivel_ensino');
  await queryInterface.dropTable('escola');
  await queryInterface.dropTable('administrador');
  await queryInterface.dropTable('usuario');
}

module.exports = { up, down };
