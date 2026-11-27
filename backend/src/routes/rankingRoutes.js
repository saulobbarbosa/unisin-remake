const express = require('express');
const AlunoController = require('../controllers/AlunoController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.get('/', authMiddleware, permitir('aluno'), AlunoController.ranking);

module.exports = router;
