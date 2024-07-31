const express = require('express');
const router = express.Router();
const { getTemperatureSensors, getSensorStatistics } = require('../controllers/graficasController');

// Ruta para obtener sensores de temperatura por ubicación
router.get('/sensor/temperature/locations', getTemperatureSensors);

// Ruta para obtener estadísticas de sensores
router.get('/statistics', getSensorStatistics);

module.exports = router;
