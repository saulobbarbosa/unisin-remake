const express = require('express');
const LojaController = require('../controllers/LojaController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/itens', LojaController.listarItens);
router.get('/itens/:id', LojaController.buscarItem);
router.post('/itens', permitir('administrador'), LojaController.criarItem);
router.put('/itens/:id', permitir('administrador'), LojaController.atualizarItem);
router.patch(
  '/itens/:id/status',
  permitir('administrador'),
  LojaController.alterarStatus
);

router.post('/comprar/:id', permitir('aluno'), LojaController.comprar);
router.get('/inventario', permitir('aluno'), LojaController.inventario);
router.get('/equipados', permitir('aluno'), LojaController.equipados);
router.post('/equipar/:id', permitir('aluno'), LojaController.equipar);
router.post('/desequipar/:id', permitir('aluno'), LojaController.desequipar);

module.exports = router;
