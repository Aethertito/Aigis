const { PaqueteComprado, Usuario, Pago, Paquete, Sensor } = require('../models/model.js');

async function comprarPaquete(req, res) {
  const { usuario_id, cartData, metodoPago, totalAmount } = req.body;

  try {
    const paquetesComprados = [];
    let totalPaquetes = 0; // Variable para contar el total de paquetes comprados

    for (const item of cartData) {
      const paquete = await Paquete.findById(item.id);
      if (!paquete) {
        return res.status(404).json({ status: "error", message: "Paquete no encontrado" });
      }

      for (let i = 0; i < item.cantidad; i++) {
        const sensores = await Promise.all(
          paquete.contenido.map(async sensorTipo => {
            const sensor = new Sensor({
              tipo: sensorTipo,
              descripcion: `${sensorTipo} sensor for ${paquete.paquete} package`,
              estado: 'active',
              usuario_id,
              paquete_id: item.id
            });
            await sensor.save();
            return { sensor_id: sensor._id, tipo: sensor.tipo };
          })
        );

        const paqueteComprado = new PaqueteComprado({
          usuario: usuario_id,
          paquete: paquete.paquete,
          ubicacion: 'Unspecified',
          sensores: sensores,
          precio: paquete.precio // Precio individual del paquete
        });

        await paqueteComprado.save();
        paquetesComprados.push(paqueteComprado);
        totalPaquetes += 1; // Incrementar el contador de paquetes
      }

      const usuario = await Usuario.findById(usuario_id);
      if (!usuario) {
        return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
      }

      usuario.paqSelect.push({ paquete_id: item.id, paquete: paquete.paquete, cantidad: item.cantidad });
      usuario.sensores.push(...paquetesComprados.flatMap(paquete => paquete.sensores));
      await usuario.save();
    }

    const pago = new Pago({
      usuario_id,
      membresia_id: null,
      metodoPago,
      estado: 'complete',
      cantidadPaquetes: totalPaquetes, // Asignar el total de paquetes comprados
      monto: totalAmount
    });

    await pago.save();

    return res.status(200).json({ status: "success", message: "Paquetes comprados correctamente", paquetesComprados, pago });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error al comprar los paquetes", error: error.message });
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

    const paqueteActualizado = await PaqueteComprado.findByIdAndUpdate(
      paqueteId,
      { ubicacion: ubicacion },
      { new: true }
    );

    if (!paqueteActualizado) {
      return res.status(404).json({ status: 'error', message: 'Paquete comprado no encontrado' });
    }

    const sensoresActualizados = await Promise.all(paqueteActualizado.sensores.map(async (sensorInfo) => {
      const sensorActualizado = await Sensor.findByIdAndUpdate(
        sensorInfo.sensor_id._id,
        { 
          ubicacion: ubicacion,
          estado: 'active',
          usuario_id: paqueteActualizado.usuario,
          paquete_id: paqueteActualizado._id
        },
        { new: true, upsert: true }
      );
      return {
        sensor_id: sensorActualizado,
        tipo: sensorActualizado.tipo,
        _id: sensorInfo._id
      };
    }));

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
