const express = require('express')
const router = express.Router()
const CitasController = require('../controllers/citas.js')

router.post('/createCita', CitasController.createCita)

module.exports = router