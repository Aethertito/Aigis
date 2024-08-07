const mongoose = require('mongoose');
const { PaqueteComprado, Estadistica, Sensor, EstadisticaRFID, Notificacion } = require('../models/model');

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
    // console.log('Received request to get max smoke value for user:', userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    // Obtener el rango de fechas para el día actual
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

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
        if (sensor.sensor_id && sensor.sensor_id.tipo === 'Smoke') {
          // Obtener estadísticas para el día actual ordenadas por valor descendente
          const estadisticas = await Estadistica.find({
            sensor_id: sensor.sensor_id._id,
            'valores.fecha': { $gte: startDate, $lte: endDate }
          }).sort({ 'valores.valor': -1 });

          if (estadisticas.length > 0) {
            // Extraer los valores de los objetos de estadísticas
            const valores = estadisticas.flatMap(est => est.valores.map(v => v.valor));
            // console.log('Valores de estadísticas del sensor:', valores);

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

    // console.log('Max smoke value found:', maxSmoke);
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

// Obtener el valor de presencia más reciente// Obtener el valor de presencia más reciente
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

// Controlador para obtener todos los eventos RFID sin filtrar
exports.getRFID = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid or missing user ID:', userId);
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    console.log('Fetching RFID events for user ID:', userId);

    // Encuentra los eventos RFID del usuario desde la colección estadisticaRFID
    const eventosRFID = await EstadisticaRFID.find({
      usuario_id: userId,
      tipo: 'RFID'
    });

    console.log('Eventos RFID encontrados:', eventosRFID);

    if (!eventosRFID.length) {
      console.log('No RFID events found for user ID:', userId);
      return res.status(404).json({ message: 'No RFID events found.' });
    }

    console.log('RFID events found:', eventosRFID.length);

    // Devuelve todos los eventos RFID sin filtrar
    res.status(200).json(eventosRFID);
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
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    let weeklyMaxValues = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(startDate.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      let maxSmokeForDay = null;

      for (const paquete of paquetesComprados) {
        for (const sensor of paquete.sensores) {
          if (sensor.sensor_id && sensor.sensor_id.tipo === 'Smoke') {
            const estadisticas = await Estadistica.find({
              sensor_id: sensor.sensor_id._id,
              'valores.fecha': { $gte: dayStart, $lte: dayEnd }
            });

            const valores = estadisticas.flatMap(est => est.valores.map(v => v.valor));
            const maxValor = Math.max(...valores.filter(v => typeof v === 'number'));

            if (!isNaN(maxValor)) {
              maxSmokeForDay = maxSmokeForDay !== null ? Math.max(maxSmokeForDay, maxValor) : maxValor;
            }
          }
        }
      }

      weeklyMaxValues.push({
        date: dayStart,
        valor: maxSmokeForDay !== null ? maxSmokeForDay : 0
      });
    }

    res.status(200).json(weeklyMaxValues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly max smoke values', error });
  }
};

exports.obtenerEntradas_Salidas = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const sensor = await Sensor.findOne({ usuario_id, tipo: 'RFID' });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor no encontrado' });
    }

    const rfid_id = sensor._id.toString();
    console.log(`ID del sensor RFID: ${rfid_id}`);

    const estadisticas = await Estadistica.findOne({ sensor_id: rfid_id });

    if (!estadisticas) {
      return res.status(404).json({ message: 'Estadísticas no encontradas para el sensor' });
    }

    if (!Array.isArray(estadisticas.valores)) {
      return res.status(400).json({ message: 'Formato incorrecto de datos en valores' });
    }

    // Obtener la última entrada
    const ultimaEntrada = estadisticas.valores
      .filter(v => v.tipo.toLowerCase() === 'entrada')
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

    // Obtener la última salida
    const ultimaSalida = estadisticas.valores
      .filter(v => v.tipo.toLowerCase() === 'salida')
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

    // Enviar los últimos eventos de entrada y salida con sus fechas
    res.json({ entrada: ultimaEntrada, salida: ultimaSalida });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el sensor o las estadísticas' });
  }
};

exports.obtenerSmoke = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Buscar el sensor de tipo 'Smoke'
    const sensor = await Sensor.findOne({ usuario_id, tipo: 'Smoke' });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor no encontrado' });
    }

    const smoke_id = sensor._id.toString();
    console.log(`ID del sensor Smoke: ${smoke_id}`);

    // Obtener el rango de fechas para el día actual
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Buscar estadísticas asociadas al sensor de tipo 'Smoke' para el día actual
    const estadisticas = await Estadistica.find({
      sensor_id: smoke_id,
      'valores.fecha': { $gte: startDate, $lte: endDate }
    });

    if (!estadisticas || estadisticas.length === 0) {
      return res.status(404).json({ message: 'No smoke data found for today' });
    }

    // Obtener los valores de humo y encontrar el máximo
    let maxValor = null;

    estadisticas.forEach(est => {
      est.valores.forEach(valor => {
        if (valor.valor && !isNaN(valor.valor)) {
          maxValor = maxValor !== null ? Math.max(maxValor, valor.valor) : valor.valor;
        }
      });
    });

    if (maxValor === null) {
      return res.status(404).json({ message: 'No valid smoke data available for today' });
    }

    console.log('Valor de humo más alto del día actual:', maxValor);
    res.json({ maxValor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el sensor o las estadísticas' });
  }
};

exports.obtenerPresence = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Buscar el sensor de tipo 'Presence'
    const sensor = await Sensor.findOne({ usuario_id, tipo: 'Presence' });

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor no encontrado' });
    }

    const presence_id = sensor._id.toString();
    console.log(`ID del sensor Presence: ${presence_id}`);

    // Buscar estadísticas asociadas al sensor de tipo 'Presence'
    const estadisticas = await Estadistica.findOne({ sensor_id: presence_id });

    if (!estadisticas) {
      return res.status(404).json({ message: 'Estadísticas no encontradas para el sensor' });
    }

    console.log('Estadisticas:', estadisticas.valores);

    // Verificar que 'valores' sea un array y no esté vacío
    if (!Array.isArray(estadisticas.valores) || estadisticas.valores.length === 0) {
      return res.status(404).json({ message: 'No hay valores registrados para este sensor' });
    }

    // Ordenar los valores por fecha en orden descendente y obtener el más reciente
    const ultimoValor = estadisticas.valores
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

    console.log('Último valor de Presence:', ultimoValor);

    // Responder con el último valor
    res.json({ ultimoValor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el sensor o las estadísticas' });
  }
};

exports.obtenerTempData = async (req, res) => {
  const { usuario_id } = req.params;
  const { startDate, endDate } = req.query;

  console.log("Received startDate:", startDate);
  console.log("Received endDate:", endDate);

  try {
    const sensor = await Sensor.findOne({ usuario_id, tipo: 'Temperature and Humidity' });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    const estadisticas = await Estadistica.findOne({ sensor_id: sensor._id });
    if (!estadisticas || !estadisticas.valores || estadisticas.valores.length === 0) {
      return res.status(404).json({ message: 'No statistics found for the sensor' });
    }

    let valores = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      console.log("Filtered Start Date:", start);
      console.log("Filtered End Date:", end);

      valores = estadisticas.valores.filter(valor => {
        const fecha = new Date(valor.fecha);
        return fecha >= start && fecha <= end;
      });

      console.log("Filtered values:", valores);
      res.json(valores);
    } else {
      // Manejo alternativo si no hay fechas
      res.status(400).json({ message: 'Invalid or missing date parameters.' });
    }
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ message: 'Error fetching temperature data' });
  }
};

exports.generateNotification = async (req, res) => {
  try {
    const { userId, tipoSensor, valor, mensaje } = req.body;

    if (!userId || !tipoSensor || !mensaje) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const nuevaNotificacion = new Notificacion({
      usuario_id: userId,
      tipoSensor,
      valor,
      mensaje,
      fecha: new Date()
    });

    await nuevaNotificacion.save();
    console.log(`Notificación enviada al usuario ${userId}: ${mensaje}`);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId, tipoSensor, fecha } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    // Verifica que la fecha sea un objeto de fecha válido
    let query = { usuario_id: userId };
    if (tipoSensor) {
      query.tipoSensor = tipoSensor;
    }
    if (fecha && !isNaN(new Date(fecha))) {
      query.fecha = { $gte: new Date(fecha) };
    }

    const notificaciones = await Notificacion.find(query).sort({ fecha: -1 });

    res.status(200).json({ status: 'success', notifications: notificaciones });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing notification ID.' });
    }

    await Notificacion.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};