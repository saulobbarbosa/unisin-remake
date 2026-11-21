const express = require('express');
const ProfessorController = require('../controllers/ProfessorController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.get('/', authMiddleware, ProfessorController.listar);
router.get('/:id', authMiddleware, ProfessorController.buscar);
router.put(
  '/:id',
  authMiddleware,
  permitir('professor', 'escola', 'administrador'),
  ProfessorController.atualizar
);

module.exports = router;
