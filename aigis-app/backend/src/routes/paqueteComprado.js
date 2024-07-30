const express = require('express');
const router = express.Router();
const PaqueteCompradoController = require('../controllers/paqueteComprado');

router.post('/comprar', PaqueteCompradoController.comprarPaquete);
router.get('/usuario/:usuarioId', PaqueteCompradoController.getPaquetePorUsuario);
router.put('/:paqueteId', PaqueteCompradoController.updateLocation);

// Mostrar paquetes con RFID
router.get('/premium/:userId', PaqueteCompradoController.paquetesRfid)
// Agregar empleado
router.post('/agregarEmpleado', PaqueteCompradoController.agregarEmpledo)
// Empleado con acceso
router.get('/:packageId/empleadosConAcceso',PaqueteCompradoController.empleadosConAcceso)
// Empleados sin acceso
router.get('/:userId/:packageId/empleadosSinAcceso', PaqueteCompradoController.empleadosSinAcceso)

router.post('/dar-acceso', PaqueteCompradoController.darAcceso)
router.post('/quitar-acceso', PaqueteCompradoController.quitarAcceso)

module.exports = router;
