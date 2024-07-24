const Estadistica = require('../models/model').Estadistica;

// Obtener estadísticas del sensor por rango de fechas y por usuario
exports.getSensorStatistics = async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const statistics = await Estadistica.find({
      usuario_id: userId,
      'valores.fecha': { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    if (!statistics.length) {
      return res.status(404).json({ message: 'No statistics found for the given user and date range.' });
    }

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};
