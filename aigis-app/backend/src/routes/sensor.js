const express = require('express')
const router = express.Router()
const SensorController = require('../controllers/sensor.js')

router.get('/', SensorController.getSensor)
router.get('/imagen/:fichero', SensorController.mostrarImagen)
router.post('/', SensorController.postSensor)
router.put('/:id', SensorController.updateSensor)
router.delete('/:id', SensorController.deleteSensor)

module.exports = router