const express = require('express');
const router = express.Router();
const PaqueteCompradoController = require('../controllers/paqueteComprado.js');

// Comprar paquete
router.post('/', PaqueteCompradoController.comprarPaquete);

module.exports = router;
