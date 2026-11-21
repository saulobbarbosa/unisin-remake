require('dotenv').config();

const http = require('http');
const app = require('./app');
const { configurarSocket } = require('./socket');
const { sequelize } = require('./models');
const { migrar } = require('../database/migrate');

const porta = Number(process.env.PORT || 3000);

async function iniciar() {
  await sequelize.authenticate();
  await migrar();

  const servidor = http.createServer(app);
  configurarSocket(servidor);

  servidor.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
}

iniciar().catch((erro) => {
  console.error('Falha ao iniciar servidor:', erro.message);
  process.exitCode = 1;
});
