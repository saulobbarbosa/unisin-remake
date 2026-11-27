const express = require('express');
const ConquistaController = require('../controllers/ConquistaController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ConquistaController.listar);
router.get('/minhas', permitir('aluno'), ConquistaController.minhas);
router.post('/', permitir('administrador'), ConquistaController.criar);
router.put('/:id', permitir('administrador'), ConquistaController.atualizar);
router.patch(
  '/:id/status',
  permitir('administrador'),
  ConquistaController.alterarStatus
);

module.exports = router;
