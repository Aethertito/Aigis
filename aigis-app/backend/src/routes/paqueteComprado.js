const express = require('express');
const router = express.Router();
const PaqueteCompradoController = require('../controllers/paqueteComprado');

router.post('/comprar', PaqueteCompradoController.comprarPaquete);
router.get('/usuario/:usuarioId', PaqueteCompradoController.getPaquetePorUsuario);
router.put('/:paqueteId', PaqueteCompradoController.updateLocation);

router.get('/premium/:userId', PaqueteCompradoController.paquetesRfid)
router.get('/:packageId/empleados', PaqueteCompradoController.empleadosConAcceso)
router.get('/getAllEmpleados/:userId', PaqueteCompradoController.getAllEmpleados)
router.post('/agregarEmpleado', PaqueteCompradoController.agregarEmpledo)
router.post('/dar-acceso', PaqueteCompradoController.darAcceso)
router.post('/quitar-acceso', PaqueteCompradoController.quitarAcceso)

module.exports = router;
