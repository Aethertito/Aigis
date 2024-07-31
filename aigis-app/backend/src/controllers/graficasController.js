const mongoose = require('mongoose');
const Usuario = require('../models/model').Usuario;
const PaqueteComprado = require('../models/model').PaqueteComprado;

// Obtener sensores de temperatura de un usuario junto con sus ubicaciones
exports.getTemperatureSensors = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Verificar que el userId esté presente y sea un ObjectId válido
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    // Convertir userId a ObjectId de MongoDB
    const objectId = mongoose.Types.ObjectId(userId);

    // Buscar los paquetes comprados por el usuario
    const paquetesComprados = await PaqueteComprado.find({ usuario: objectId }).populate('sensores.sensor_id');
    if (!paquetesComprados || paquetesComprados.length === 0) {
      return res.status(404).json({ message: 'No packages found for this user.' });
    }

    // Filtrar sensores de tipo "Temperature and Humidity" y añadir la ubicación
    const temperatureSensors = [];
    paquetesComprados.forEach(paquete => {
      paquete.sensores.forEach(sensor => {
        if (sensor.sensor_id && sensor.sensor_id.tipo === 'Temperature and Humidity') {
          temperatureSensors.push({
            _id: sensor.sensor_id._id,
            descripcion: sensor.sensor_id.descripcion,
            ubicacion: paquete.ubicacion || 'Unspecified location'
          });
        }
      });
    });

    if (temperatureSensors.length === 0) {
      return res.status(404).json({ message: 'No temperature sensors found for this user.' });
    }

    res.status(200).json(temperatureSensors);
  } catch (error) {
    console.error('Error fetching temperature sensors:', error);
    res.status(500).json({ message: 'Error fetching temperature sensors', error });
  }
};

exports.getSensorStatistics = async (req, res) => {
  const { sensorId, startDate, endDate } = req.query;

  try {
    const statistics = await Estadistica.find({
      sensor_id: sensorId,
      'valores.fecha': { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    if (!statistics.length) {
      return res.status(404).json({ message: 'No statistics found for the given sensor and date range.' });
    }

    res.status(200).json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};
