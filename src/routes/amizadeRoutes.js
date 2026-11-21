const express = require('express');
const AmizadeController = require('../controllers/AmizadeController');
const authMiddleware = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.use(authMiddleware, permitir('aluno'));

router.get('/', AmizadeController.listar);
router.get('/buscar', AmizadeController.buscar);
router.post('/', AmizadeController.adicionar);
router.delete('/:id', AmizadeController.remover);

module.exports = router;
