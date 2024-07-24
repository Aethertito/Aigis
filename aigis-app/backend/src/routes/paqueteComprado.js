const express = require('express');
const router = express.Router();
const { comprarPaquete } = require('../controllers/paqueteComprado');

router.post('/comprar', comprarPaquete);

module.exports = router;
