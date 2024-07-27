const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/pago.js');

// Hacer pago
router.post('/', PagoController.pago);
router.get('/payments', PagoController.getMemPagos);
router.get('/packpayments', PagoController.getPaqPagos);

module.exports = router;
