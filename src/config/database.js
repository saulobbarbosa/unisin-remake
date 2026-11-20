const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

require('dotenv').config();

const ehTeste = process.env.NODE_ENV === 'test';
const dialect = process.env.DB_DIALECT || 'sqlite';

const opcoes = {
  dialect,
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  define: {
    timestamps: false,
    freezeTableName: true
  }
};

if (dialect === 'sqlite') {
  const storage = ehTeste ? ':memory:' : (process.env.DB_STORAGE || './database/database.sqlite');
  if (storage !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(storage)), { recursive: true });
  }
  opcoes.storage = storage;
} else {
  opcoes.host = process.env.DB_HOST || 'localhost';
  opcoes.port = Number(process.env.DB_PORT || 3306);
  opcoes.database = process.env.DB_NAME;
  opcoes.username = process.env.DB_USER;
  opcoes.password = process.env.DB_PASSWORD;
}

module.exports = new Sequelize(opcoes);
