const { migrar } = require('../../database/migrate');
const { sequelize } = require('../../src/models');

async function prepararBanco() {
  await migrar();
}

async function fecharBanco() {
  await sequelize.close();
}

module.exports = { prepararBanco, fecharBanco };
