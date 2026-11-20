require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const { migrar } = require('../database/migrate');

const porta = Number(process.env.PORT || 3000);

async function iniciar() {
  await sequelize.authenticate();
  await migrar();

  app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
}

iniciar().catch((erro) => {
  console.error('Falha ao iniciar servidor:', erro.message);
  process.exitCode = 1;
});
