const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.js');

// Registrar usuario
router.post('/signup', UsuarioController.signup);
// Login
router.post('/login', UsuarioController.login);
// Obtener datos de un usuario
router.get('/:userId', UsuarioController.getUsuario);

// CRUD
router.get('/', UsuarioController.getAllUser);
router.put('/:userId', UsuarioController.updateUser);
router.delete('/:userId', UsuarioController.deleteUser);

// Ayuda
router.post('/help', UsuarioController.helpUser);
router.get('/support/comments', UsuarioController.getComments);

// Historial de soporte de un usuario
router.get('/:userId/help', UsuarioController.getSupportHistory);

// Agregar compañía
router.post('/addCompany', UsuarioController.addCompany);

module.exports = router;
