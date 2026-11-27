const express = require('express');
const PvpController = require('../controllers/PvpController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware, permitir('aluno'));

router.post('/convites', PvpController.criarConvite);
router.post('/convites/:id/aceitar', PvpController.aceitarConvite);
router.post('/convites/:id/recusar', PvpController.recusarConvite);
router.get('/partida/atual', PvpController.partidaAtual);
router.get('/vitorias', PvpController.vitorias);

module.exports = router;
