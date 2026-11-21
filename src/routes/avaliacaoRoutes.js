const express = require('express');
const AvaliacaoController = require('../controllers/AvaliacaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.post('/iniciar', authMiddleware, permitir('aluno'), AvaliacaoController.iniciar);
router.post('/finalizar', authMiddleware, permitir('aluno'), AvaliacaoController.finalizar);

module.exports = router;
