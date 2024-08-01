const express = require('express');
const router = express.Router();
const { getTemperatureSensors, getSensorStatistics, getMaxSmokeValue, getUserSensors, getPresenceData } = require('../controllers/graficasController');

// Ruta para obtener sensores de temperatura por ubicación
router.get('/sensor/temperature/locations', getTemperatureSensors);

// Ruta para obtener estadísticas de sensores
router.get('/statistics', getSensorStatistics);

// Ruta para obtener el valor máximo del sensor de humo
router.get('/sensor/smoke/max', getMaxSmokeValue);

// Ruta para obtener todos los sensores de un usuario
router.get('/sensors', getUserSensors);

// Ruta para obtener datos de presencia
router.get('/sensor/presence', getPresenceData);

module.exports = router;
