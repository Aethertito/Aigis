const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.js')

// Registrar usuario
router.post('/signup', UsuarioController.signup)
// Login
router.post('/login', UsuarioController.login)


module.exports = router