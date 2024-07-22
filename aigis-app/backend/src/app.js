// Importar dependencias
const connection = require('./database/connection.js')
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
// Conexion a BD
connection()

// Crear servidor node
const app = express()
const port = 3000

// Configurar cors
app.use(cors())

// Configurar multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/img/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

//const upload = multer({storage: storage})

app.use(multer({
  storage: storage
}).single('image'))

// Middleware para servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Convertir los datos del body a JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cargar conf rutas
const UsuarioRoutes = require('./routes/usuario.js')
const SensorRoutes = require('./routes/sensor.js')
const MembershipRoutes = require('./routes/membership.js')
const PackageRoutes = require('./routes/package.js')
const PagoRoutes = require('./routes/pago.js');
const CitaRoutes = require('./routes/citas.js')

app.use('/usuario', UsuarioRoutes)
app.use('/sensor', SensorRoutes)
app.use('/membership', MembershipRoutes)
app.use('/packages', PackageRoutes)
app.use('/pago', PagoRoutes);
app.use('/cita', CitaRoutes);

// Poner servidor a escuchar paticiones http
app.listen(port, () => {
  console.log(`Servidor iniciando en el ${port}`)
})