const express = require('express');
const AlunoController = require('../controllers/AlunoController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.post('/', AlunoController.criar);
router.get('/me', authMiddleware, permitir('aluno'), AlunoController.me);
router.put('/me', authMiddleware, permitir('aluno'), AlunoController.atualizarMe);
router.get('/:id', authMiddleware, AlunoController.buscar);
router.get('/', authMiddleware, AlunoController.listar);

module.exports = router;
