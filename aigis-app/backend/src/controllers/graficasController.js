const mongoose = require('mongoose');
const { PaqueteComprado, Estadistica } = require('../models/model');

// Obtener sensores de temperatura de un usuario junto con sus ubicaciones
exports.getTemperatureSensors = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    console.log('User ID as ObjectId:', objectId);

    const paquetesComprados = await PaqueteComprado.find({ usuario: objectId }).populate('sensores.sensor_id');
    console.log('Paquetes comprados:', paquetesComprados);

    if (!paquetesComprados || paquetesComprados.length === 0) {
      console.log('No packages found for this user.');
      return res.status(404).json({ message: 'No packages found for this user.' });
    }

    const temperatureSensors = {};
    paquetesComprados.forEach(paquete => {
      const ubicacion = paquete.ubicacion || 'Unspecified location';
      paquete.sensores.forEach(sensor => {
        if (sensor.sensor_id && sensor.sensor_id.tipo === 'Temperature and Humidity') {
          if (!temperatureSensors[ubicacion]) {
            temperatureSensors[ubicacion] = [];
          }
          temperatureSensors[ubicacion].push({
            sensor_id: sensor.sensor_id._id,
            descripcion: sensor.sensor_id.descripcion,
          });
        }
      });
    });

    console.log('Temperature sensors grouped by location:', temperatureSensors);

    if (Object.keys(temperatureSensors).length === 0) {
      console.log('No temperature sensors found for this user.');
      return res.status(404).json({ message: 'No temperature sensors found for this user.' });
    }

    res.status(200).json({ status: 'success', sensores: temperatureSensors });
  } catch (error) {
    console.error('Error fetching temperature sensors:', error);
    res.status(500).json({ message: 'Error fetching temperature sensors', error });
  }
};

// Asegurar que la consulta para estadísticas de sensores traiga todos los datos
exports.getSensorStatistics = async (req, res) => {
  const { sensorIds, startDate, endDate } = req.query;

  try {
    const sensorIdArray = sensorIds.split(',').map(id => new mongoose.Types.ObjectId(id));

    const statistics = await Estadistica.find({
      sensor_id: { $in: sensorIdArray },
      'valores.fecha': { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    if (!statistics.length) {
      return res.status(404).json({ message: 'No statistics found for the given sensor and date range.' });
    }

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

// Controlador para obtener el valor máximo del sensor de humo
exports.getMaxSmokeValue = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('Received request to get max smoke value for user:', userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    // Encontrar paquetes comprados con sensores de tipo "Smoke"
    const paquetesComprados = await PaqueteComprado.find({ usuario: userId, "sensores.tipo": "Smoke" }).populate('sensores.sensor_id');
    console.log('Found paquetesComprados:', paquetesComprados);

    if (!paquetesComprados || paquetesComprados.length === 0) {
      console.log('No smoke sensors found for this user.');
      return res.status(404).json({ message: 'No smoke sensors found for this user.' });
    }

    let maxSmoke = null;

    for (const paquete of paquetesComprados) {
      for (const sensor of paquete.sensores) {
        console.log('Processing sensor:', sensor);
        if (sensor.tipo === 'Smoke') {
          // Obtener estadísticas ordenadas por valor descendente
          const estadisticas = await Estadistica.find({ sensor_id: sensor.sensor_id }).sort({ 'valores.valor': -1 });

          if (estadisticas.length > 0) {
            // Extraer los valores de los objetos de estadísticas
            const valores = estadisticas.flatMap(est => est.valores.map(v => v.valor));
            console.log('Valores de estadísticas del sensor:', valores);

            // Filtrar valores no numéricos y encontrar el máximo
            const maxValor = Math.max(...valores.filter(v => typeof v === 'number'));

            if (!isNaN(maxValor)) {
              maxSmoke = maxSmoke !== null ? Math.max(maxSmoke, maxValor) : maxValor;
            }
          }
        }
      }
    }

    if (maxSmoke === null) {
      console.log('No valid smoke data available.');
      return res.status(404).json({ message: 'No valid smoke data available.' });
    }

    console.log('Max smoke value found:', maxSmoke);
    res.status(200).json({ maxValue: maxSmoke });
  } catch (error) {
    console.error('Error fetching max smoke value:', error);
    res.status(500).json({ message: 'Error fetching max smoke value', error });
  }
};



// Obtener sensores de un usuario
exports.getUserSensors = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    const paquetesComprados = await PaqueteComprado.find({ usuario: userId }).populate('sensores.sensor_id');
    console.log('Paquetes comprados:', paquetesComprados);

    if (!paquetesComprados || paquetesComprados.length === 0) {
      console.log('No sensors found for this user.');
      return res.status(404).json({ message: 'No sensors found for this user.' });
    }

    const sensors = [];
    paquetesComprados.forEach(paquete => {
      paquete.sensores.forEach(sensor => {
        if (sensor.sensor_id) {
          sensors.push({
            _id: sensor.sensor_id._id,
            tipo: sensor.sensor_id.tipo,
            descripcion: sensor.sensor_id.descripcion,
            ubicacion: paquete.ubicacion || 'Unspecified location',
          });
        }
      });
    });

    console.log('User sensors:', sensors);
    res.status(200).json({ status: 'success', sensores: sensors });
  } catch (error) {
    console.error('Error fetching user sensors:', error);
    res.status(500).json({ message: 'Error fetching user sensors', error });
  }
};

// Obtener el valor de presencia más reciente
exports.getPresenceData = async (req, res) => {
  try {
      const { userId } = req.query;

      // Verificar si el usuario tiene un sensor de presencia
      const presenceSensor = await Sensor.findOne({ usuario_id: userId, tipo: 'Presence' });
      if (!presenceSensor) {
          return res.status(404).json({ error: 'Presence sensor not found for this user.' });
      }

      // Obtener datos de presencia
      const presenceData = await Estadistica.find({ sensor_id: presenceSensor._id, tipo: 'Presence' });

      return res.json({ valores: presenceData });
  } catch (error) {
      console.error('Error fetching presence data:', error);
      res.status(500).json({ error: 'Failed to fetch presence data.' });
  }
};

// Controlador para obtener eventos RFID
exports.getRFID = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    console.log('Fetching RFID events for sensor_id:', userId);

    const sensorObjectId = new mongoose.Types.ObjectId(userId);

    const eventosRFID = await Estadistica.find({
      sensor_id: sensorObjectId,
      tipo: 'RFID'
    });

    console.log('Documents found:', eventosRFID.length);

    if (!eventosRFID.length) {
      console.log('No RFID events found for sensor_id:', userId);
      return res.status(404).json({ message: 'No RFID events found.' });
    }

    const rfidEvents = eventosRFID.flatMap(evento => {
      console.log('Processing document:', evento);
      if (!evento.historial || !Array.isArray(evento.historial)) {
        console.warn('Event has no valid history:', evento);
        return []; // Skip events without valid history
      }
      return evento.historial.filter(h => h.tipo === 'entrada' || h.tipo === 'salida');
    });

    console.log('RFID Events extracted:', rfidEvents);

    if (!rfidEvents.length) {
      console.log('No valid RFID events found in history for sensor_id:', userId);
      return res.status(404).json({ message: 'No valid RFID events found in history.' });
    }

    rfidEvents.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    console.log('Sorted RFID events:', rfidEvents);

    res.status(200).json(rfidEvents);
  } catch (error) {
    console.error('Error fetching RFID events:', error);
    res.status(500).json({ message: 'Error fetching RFID events', error: error.message });
  }
};

// Controlador para obtener los valores máximos de humo de los últimos 7 días
exports.getWeeklyMaxSmokeValues = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    const paquetesComprados = await PaqueteComprado.find({ usuario: userId, "sensores.tipo": "Smoke" }).populate('sensores.sensor_id');

    if (!paquetesComprados || paquetesComprados.length === 0) {
      return res.status(404).json({ message: 'No smoke sensors found for this user.' });
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    const weeklyMaxValues = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(startDate.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const statistics = await Estadistica.find({
        sensor_id: { $in: paquetesComprados.map(p => p.sensores.map(s => s.sensor_id)).flat() },
        'valores.fecha': { $gte: dayStart, $lte: dayEnd }
      });

      let maxSmoke = null;
      for (const stat of statistics) {
        for (const val of stat.valores) {
          if (val.valor !== null && typeof val.valor === 'number') {
            maxSmoke = maxSmoke !== null ? Math.max(maxSmoke, val.valor) : val.valor;
          }
        }
      }

      weeklyMaxValues.push({ date: dayStart, valor: maxSmoke });
    }

    res.status(200).json(weeklyMaxValues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly max smoke values', error });
  }
};
