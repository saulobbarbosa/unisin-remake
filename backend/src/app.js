const express = require('express');
const path = require('path');
const rotas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', rotas);
app.use(
  '/auditoria',
  express.static(path.join(__dirname, '..', 'public', 'auditoria'))
);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

module.exports = app;
