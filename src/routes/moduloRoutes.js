const express = require('express');
const ModuloController = require('../controllers/ModuloController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ModuloController.listar);
router.get('/meus', permitir('aluno'), ModuloController.meus);
router.get('/:id', ModuloController.buscar);
router.post(
  '/',
  permitir('administrador', 'professor'),
  ModuloController.criar
);
router.put(
  '/:id',
  permitir('administrador', 'professor'),
  ModuloController.atualizar
);
router.post(
  '/:id/alunos',
  permitir('administrador', 'professor'),
  ModuloController.associarAluno
);
router.patch(
  '/:id/progresso',
  permitir('aluno'),
  ModuloController.atualizarProgresso
);

module.exports = router;
