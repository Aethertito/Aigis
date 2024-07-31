const express = require('express')
const router = express.Router()
const CitasController = require('../controllers/citas.js')

router.post('/createCita', CitasController.createCita)
router.get('/', CitasController.getAllCitas)
router.put('/:id', CitasController.confirmCita)
router.put('/attend/:id', CitasController.attendCita) 

module.exports = router
