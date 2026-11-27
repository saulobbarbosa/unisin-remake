const express = require('express');
const AuditoriaController = require('../controllers/AuditoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware, permitir('administrador'));

router.get('/', AuditoriaController.listar);
router.get('/verificar', AuditoriaController.verificar);

module.exports = router;
