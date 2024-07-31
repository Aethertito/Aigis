const express = require('express');
const router = express.Router();
const { getSensorStatistics, getTemperatureSensors } = require('../controllers/graficasController');

router.get('/statistics', getSensorStatistics);
router.get('/temperature-sensors', getTemperatureSensors);

module.exports = router;
