const express = require('express');
const AtividadeController = require('../controllers/AtividadeController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.post('/', authMiddleware, permitir('professor'), AtividadeController.criar);
router.get('/', authMiddleware, AtividadeController.listar);
router.get('/concluidas', authMiddleware, permitir('aluno'), AtividadeController.concluidas);
router.get('/:id', authMiddleware, AtividadeController.buscar);
router.put('/:id', authMiddleware, permitir('professor'), AtividadeController.atualizar);
router.patch(
  '/:id/status',
  authMiddleware,
  permitir('professor'),
  AtividadeController.alterarStatus
);
router.post(
  '/:id/responder',
  authMiddleware,
  permitir('aluno'),
  AtividadeController.responder
);

module.exports = router;
