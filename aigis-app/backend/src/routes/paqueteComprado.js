const express = require('express');
const router = express.Router();
const PaqueteCompradoController = require('../controllers/paqueteComprado');

router.post('/comprar', PaqueteCompradoController.comprarPaquete);
router.get('/usuario/:usuarioId', PaqueteCompradoController.getPaquetePorUsuario);

module.exports = router;
