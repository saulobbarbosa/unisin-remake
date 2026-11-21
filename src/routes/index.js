const express = require('express');

const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const alunoRoutes = require('./alunoRoutes');
const escolaRoutes = require('./escolaRoutes');
const professorRoutes = require('./professorRoutes');
const administradorRoutes = require('./administradorRoutes');
const atividadeRoutes = require('./atividadeRoutes');
const avaliacaoRoutes = require('./avaliacaoRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/alunos', alunoRoutes);
router.use('/escolas', escolaRoutes);
router.use('/professores', professorRoutes);
router.use('/administradores', administradorRoutes);
router.use('/atividades', atividadeRoutes);
router.use('/avaliacoes', avaliacaoRoutes);

module.exports = router;
