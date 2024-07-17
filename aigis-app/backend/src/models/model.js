const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Usuario Schema
const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'administrador'], required: true },
  direccion: { type: String },
  telefono: { type: String },
  giro: { type: String },
  sensores: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }],
  membresia: { type: Boolean }
});

// Sensor Schema
const sensorSchema = new Schema({
  tipo: { type: String },
  descripcion: { type: String },
  precio: { type: Number },
  imagen: { type: String },
  ubicacion: { type: String },
  estado: { type: String, enum: ['activo', 'inactivo'] },
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
  fecha: { type: Date },
  estado: { type: String, enum: ['pendiente', 'confirmada', 'cancelada'] },
  direccion: { type: String }
});

// Pago Schema
const pagoSchema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  monto: { type: Number },
  fecha: { type: Date },
  metodo_pago: { type: String },
  estado: { type: String, enum: ['completado', 'pendiente', 'fallido'] }
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
  estado: { type: String, enum: ['pendiente', 'resuelto'] }
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
  estado: { type: String, enum: ['activa', 'inactiva'] }
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

module.exports = {
  Usuario,
  Sensor,
  Cita,
  Pago,
  Notificacion,
  Comentario,
  Estadistica,
  Accesibilidad,
  TarjetaRFID
};
