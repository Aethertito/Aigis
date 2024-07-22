const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Usuario Schema
const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['user', 'administrator'], required: true },
  direccion: { type: String },
  telefono: { type: String },
  giro: { type: String },
  sensores: [ { tipo: { type: String }, descripcion: { type: String } } ],
  membresia: { cantidad: { type: Number }, periodo: { type: String }, descripcion: { type: String } },
  memActiva: { type: Boolean, default: false },
  memFechaInicio: { type: Date },
  memFechaFin: { type: Date },
  paqSelect: [ { paquete: { type: String }, descripcion: { type: String }, cantidad: { type: Number } } ]
});


// Sensor Schema
const sensorSchema = new Schema({
  tipo: { type: String },
  descripcion: { type: String },
  precio: { type: Number },
  imagen: { type: String },
  ubicacion: { type: String },
  estado: { type: String, enum: ['active', 'inactive'] },
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  lecturas: [
    {
      fecha: { type: Date },
      valor: { type: Schema.Types.Mixed }
    }
  ]
});

// Cita Schema
const citaSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true, enum: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] },
  colonia: { type: String, required: true },
  calle: { type: String, required: true },
  numero: { type: String, required: true },
  referencia: { type: String, maxlength: 50 },
  estado: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' }
});

// Pago Schema
const pagoSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  membresia_id: { type: Schema.Types.ObjectId, ref: 'Membresia' },
  paquetes: [ { paquete_id: { type: Schema.Types.ObjectId, ref: 'Paquete' }, cantidad: { type: Number, required: true } } ],
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  metodoPago: { type: String, required: true },
  estado: { type: String, enum: ['complete', 'pending', 'failed'], default: 'pending' }
});





// Notificacion Schema
const notificacionSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  mensaje: { type: String },
  tipo: { type: String },
  fecha: { type: Date },
  leido: { type: Boolean }
});

// Comentario Schema
const comentarioSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  sensor_id: { type: Schema.Types.ObjectId, ref: 'Sensor' },
  mensaje: { type: String },
  fecha: { type: Date },
  estado: { type: String, enum: ['pending', 'resolved'] }
});

// Estadistica Schema
const estadisticaSchema = new Schema({
  sensor_id: { type: Schema.Types.ObjectId, ref: 'Sensor' },
  tipo: { type: String },
  valores: [
    {
      fecha: { type: Date },
      valor: { type: Number }
    }
  ]
});

// Accesibilidad Schema
const accesibilidadSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  ubicacion: { type: String },
  historial: [
    {
      fecha: { type: Date },
      accion: { type: String }
    }
  ]
});

// Tarjeta de Acceso RFID Schema
const tarjetaRFIDSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  codigo: { type: String },
  estado: { type: String, enum: ['active', 'Inactive'] }
});

// Membresia Schema
const membresiaSchema = new Schema({
  cantidad: { type: Number, required: true }, // Numero de meses
  periodo: { type: [String], required: true }, // "Meses" o "Anual"
  descripcion: { type: [String], required: true },
  precio: { type: Number, required: true }
});

// Paquete Schema
const paqueteSchema = new Schema({
  paquete: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  contenido: { type: [String], required: true }
});

// Crear los modelos
const Usuario = model('Usuario', usuarioSchema);
const Sensor = model('Sensor', sensorSchema);
const Cita = model('Cita', citaSchema);
const Pago = model('Pago', pagoSchema);
const Notificacion = model('Notificacion', notificacionSchema);
const Comentario = model('Comentario', comentarioSchema);
const Estadistica = model('Estadistica', estadisticaSchema);
const Accesibilidad = model('Accesibilidad', accesibilidadSchema);
const TarjetaRFID = model('TarjetaRFID', tarjetaRFIDSchema);
const Membresia = model('Membresias', membresiaSchema);
const Paquete = model('Paquetes', paqueteSchema);

module.exports = {
  Usuario,
  Sensor,
  Cita,
  Pago,
  Notificacion,
  Comentario,
  Estadistica,
  Accesibilidad,
  TarjetaRFID,
  Membresia,
  Paquete
};
