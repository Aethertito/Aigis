const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['user', 'administrator'], required: true },
  direccion: { type: String },
  telefono: { type: String },
  giro: { type: String },
  membresia: { type: Schema.Types.ObjectId, ref: 'Membresia' },
  memCantidad: { type: Number },
  memPeriodo: { type: String },
  memDescripcion: { type: String },
  memActiva: { type: Boolean, default: false },
  memFechaInicio: { type: Date },
  memFechaFin: { type: Date },
  paqSelect: [
    { 
      paquete_id: { type: Schema.Types.ObjectId, ref: 'Paquete' },
      paquete: { type: String }, 
      cantidad: { type: Number, required: true }
    }
  ],
  sensores: [{
    sensor_id: { type: Schema.Types.ObjectId, ref: 'Sensor' },
    tipo: { type: String } 
  }]
});

const sensorSchema = new Schema({
  tipo: { type: String, enum: ['RFID', 'Temperature and Humidity', 'Smoke', 'Presence', 'Camera'], required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  ubicacion: { type: String },
  estado: { type: String, enum: ['active', 'inactive'], default: 'active' },
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  paquete_id: { type: Schema.Types.ObjectId, ref: 'Paquete', required: true }
});

const estadisticaSchema = new Schema({
  sensor_id: { type: Schema.Types.ObjectId, ref: 'Sensor', required: true },
  tipo: { type: String, enum: ['RFID', 'Temperature and Humidity', 'Smoke', 'Presence', 'Camera'], required: true },
  valores: [
    {
      fecha: { type: Date, default: Date.now },
      valor: { type: Schema.Types.Mixed, required: true }
    }
  ]
});

const paqueteSchema = new Schema({
  paquete: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  contenido: [{ type: String, enum: ['RFID', 'Temperature and Humidity', 'Smoke', 'Presence', 'Camera'], required: true }]
});

const membresiaSchema = new mongoose.Schema({
  cantidad: { type: Number, required: true },
  periodo: { type: String, required: true},
  descripcion: { type: String, required: true },
  costo: { type: Number, required: true }
});

const pagoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  membresia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Membresia' },
  metodoPago: { type: String, required: true },
  estado: { type: String, enum: ['complete', 'pending', 'failed'], default: 'pending' },
  fechaPago: { type: Date, default: Date.now}
});

const paqueteCompradoSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  paquete: { type: String, required: true },
  ubicacion: { type: String, required: true },
  precio: { type: Number, required: true },
  sensores: [{
    sensor_id: { type: Schema.Types.ObjectId, ref: 'Sensor', required: true },
    tipo: { type: String, required: true }
  }],
});



const Usuario = model('Usuario', usuarioSchema);
const Sensor = model('Sensor', sensorSchema);
const Paquete = model('Paquete', paqueteSchema);
const Estadistica = model('Estadistica', estadisticaSchema);
const Pago = mongoose.model('Pago', pagoSchema);
const Membresia = mongoose.model('Membresia', membresiaSchema);
const PaqueteComprado = mongoose.model('PaqueteComprado', paqueteCompradoSchema);

module.exports = {
  Usuario,
  Sensor,
  Paquete,
  Estadistica,
  Membresia,
  Pago,
  PaqueteComprado
};
