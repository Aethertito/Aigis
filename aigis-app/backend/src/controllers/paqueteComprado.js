const { PaqueteComprado, Usuario, Pago, Paquete, Sensor } = require('../models/model.js');

async function comprarPaquete(req, res) {
  const { usuario_id, paquete_id, ubicacion, metodoPago } = req.body;

  try {
    const paquete = await Paquete.findById(paquete_id);
    if (!paquete) {
      return res.status(404).json({ status: "error", message: "Paquete no encontrado" });
    }

    const sensores = await Promise.all(
      paquete.contenido.map(async sensorTipo => {
        const sensor = new Sensor({
          tipo: sensorTipo,
          descripcion: `${sensorTipo} sensor for ${paquete.paquete} package`,
          estado: 'active',
          usuario_id,
          paquete_id
        });
        await sensor.save();
        return { sensor_id: sensor._id, tipo: sensor.tipo };
      })
    );

    const paqueteComprado = new PaqueteComprado({
      usuario: usuario_id,
      paquete: paquete.paquete,
      ubicacion,
      sensores: sensores,
      precio: paquete.precio 
    });

    await paqueteComprado.save();

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    usuario.paqSelect.push({ paquete_id, paquete: paquete.paquete, cantidad: 1 });

    usuario.sensores.push(...sensores);
    await usuario.save();

    const pago = new Pago({
      usuario_id,
      membresia_id: null,
      paquete_id,
      monto: paquete.precio,
      metodoPago,
      estado: 'complete'
    });

    await pago.save();

    return res.status(200).json({ status: "success", message: "Paquete comprado correctamente", paqueteComprado, pago });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error al comprar el paquete", error: error.message });
  }
}

const getPaquetePorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const paquetesComprados = await PaqueteComprado.find({ usuario: usuarioId }).populate('sensores.sensor_id').exec();
    return res.status(200).json({
      status: "success",
      paquetesComprados
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error retrieving purchased packages",
      error: error.message
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { paqueteId } = req.params;
    const { ubicacion } = req.body;

    if (!ubicacion) {
      return res.status(400).json({ status: 'error', message: 'Ubicación no proporcionada' });
    }

    // Actualizar el paquete comprado
    const paqueteActualizado = await PaqueteComprado.findByIdAndUpdate(
      paqueteId,
      { ubicacion: ubicacion },
      { new: true }
    );

    if (!paqueteActualizado) {
      return res.status(404).json({ status: 'error', message: 'Paquete comprado no encontrado' });
    }

    // Actualizar o crear instancias de sensores
    const sensoresActualizados = await Promise.all(paqueteActualizado.sensores.map(async (sensorInfo) => {
      const sensorActualizado = await Sensor.findByIdAndUpdate(
        sensorInfo.sensor_id._id,
        { 
          ubicacion: ubicacion,
          estado: 'active',
          usuario_id: paqueteActualizado.usuario,
          paquete_id: paqueteActualizado._id
        },
        { new: true, upsert: true } // Esto crea el sensor si no existe
      );
      return {
        sensor_id: sensorActualizado,
        tipo: sensorActualizado.tipo,
        _id: sensorInfo._id
      };
    }));

    // Actualizar el paquete con los sensores actualizados
    paqueteActualizado.sensores = sensoresActualizados;
    await paqueteActualizado.save();

    res.json({
      status: 'success',
      message: 'Ubicación actualizada con éxito',
      paquete: paqueteActualizado
    });

  } catch (error) {
    console.error('Error al actualizar la ubicación del paquete y sensores:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
}

module.exports = {
  comprarPaquete,
  getPaquetePorUsuario,
  updateLocation
};
