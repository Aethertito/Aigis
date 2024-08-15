const express = require('express');
const router = express.Router();
const {
    getTemperatureSensors,
    getSensorStatistics,
    getMaxSmokeValue,
    getUserSensors,
    getPresenceData,
    getWeeklyMaxSmokeValues,
    getRFID,
    obtenerEntradas_Salidas,
    obtenerSmoke,
    obtenerPresence,
    obtenerTempData,
    getUserNotifications,
    generateNotification,
    deleteNotification
} = require('../controllers/graficasController');

// Rutas de los sensores de temperatura
router.get('/sensor/temperature/locations', getTemperatureSensors);

// Rutas de las estadísticas de los sensores
router.get('/statistics', getSensorStatistics);

// Rutas del valor máximo del sensor de humo
router.get('/sensor/smoke/max', getMaxSmokeValue);

// Rutas para obtener sensores de usuario
router.get('/sensors', getUserSensors);

// Rutas para obtener datos de presencia
router.get('/sensor/presence', getPresenceData);

// Rutas para obtener eventos RFID
router.get('/sensor/rfid/events', getRFID);

// Rutas para obtener el valor máximo semanal del humo
router.get('/smoke/weeklyMax', getWeeklyMaxSmokeValues);

// Obtener entradas
router.get('/entradas-salidas/:usuario_id', obtenerEntradas_Salidas)

// Obtener smoke
router.get('/obtener-smoke/:usuario_id', obtenerSmoke)

// Obtener ultimo valor de presencia
router.get('/ultmo-valor-presencia/:usuario_id', obtenerPresence)

// Obtener valores de temp
router.get('/valores-temp/:usuario_id',obtenerTempData)

router.get('/notifications', getUserNotifications);
router.post('/notifications', generateNotification);
router.delete('/notifications/:id', deleteNotification);



module.exports = router;
