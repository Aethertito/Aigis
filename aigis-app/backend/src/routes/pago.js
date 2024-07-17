const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/pago.js');

//Hacer pago
router.post('/', PagoController.pago);

module.exports = router;
