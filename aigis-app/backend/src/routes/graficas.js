const express = require('express');
const router = express.Router();
const graficasController = require('../controllers/graficasController');

router.get('/statistics', graficasController.getSensorStatistics);

module.exports = router;
