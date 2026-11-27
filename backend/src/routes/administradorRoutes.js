const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.post('/', authMiddleware, permitir('administrador'), AuthController.cadastrarAdministrador);

module.exports = router;
