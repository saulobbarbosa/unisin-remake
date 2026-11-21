const express = require('express');
const rotas = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', rotas);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

module.exports = app;
