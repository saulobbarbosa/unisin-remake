const express = require('express');
const EscolaController = require('../controllers/EscolaController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.post('/', EscolaController.criar);
router.post('/professores', authMiddleware, permitir('escola'), EscolaController.criarProfessor);

module.exports = router;
