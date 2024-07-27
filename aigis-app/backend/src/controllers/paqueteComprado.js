const { PaqueteComprado, Usuario, Pago, Paquete, Sensor, Empleado, AccesoRFID } = require('../models/model.js');

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

const paquetesRfid = async (req, res) => {
  try {
    const { userId } = req.params

    const paquetes = await PaqueteComprado.find({
      usuario: userId,
      paquete: 'Premium Security'
    });

    res.status(200).json(paquetes);
  } catch (error) {
    console.error('Error al obtener paquetes RFID:', error);
    res.status(500).json({ mensaje: 'Error al obtener paquetes RFID' });
  }
};

const empleadosConAcceso = async (req, res) => {
  try {
    const { packageId } = req.params;
    const accesos = await AccesoRFID.find({ paqueteComprado: packageId })
      .populate('empleado', 'nombre email telefono');

    const empleadosConAcceso = accesos.map(acceso => ({
      id: acceso.empleado._id,
      nombre: acceso.empleado.nombre,
      email: acceso.empleado.email,
      telefono: acceso.empleado.telefono,
    }));

    res.status(200).json(empleadosConAcceso);
  } catch (error) {
    console.error('Error al obtener empleados con acceso:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleados con acceso' });
  }
}

const getAllEmpleados = async (req, res) => {
  try {
    const { userId } = req.params;
    const empleados = await Empleado.find({ usuario: userId }, 'nombre email telefono');
    res.status(200).json(empleados);
  } catch (error) {
    console.error('Error al obtener todos los empleados:', error);
    res.status(500).json({ mensaje: 'Error al obtener todos los empleados' });
  }
}

const darAcceso = async (req, res) => {
  try {
    const { employeeId, packageId } = req.body;

    // Verificar si ya tiene acceso
    const accesoExistente = await AccesoRFID.findOne({
      empleado: employeeId,
      paqueteComprado: packageId
    });

    if (accesoExistente) {
      return res.status(400).json({ mensaje: 'El empleado ya tiene acceso a este paquete' });
    }

    // Crear nuevo acceso
    const nuevoAcceso = new AccesoRFID({
      empleado: employeeId,
      paqueteComprado: packageId
    });
    await nuevoAcceso.save();

    res.status(201).json({ mensaje: 'Acceso otorgado con éxito' });
  } catch (error) {
    console.error('Error al dar acceso:', error);
    res.status(500).json({ mensaje: 'Error al dar acceso' });
  }
}

const quitarAcceso = async (req, res) => {
  try {
    const { employeeId, packageId } = req.body;

    const resultado = await AccesoRFID.findOneAndDelete({
      empleado: employeeId,
      paqueteComprado: packageId
    });

    if (!resultado) {
      return res.status(404).json({ mensaje: 'No se encontró el acceso para quitar' });
    }

    res.status(200).json({ mensaje: 'Acceso removido con éxito' });
  } catch (error) {
    console.error('Error al quitar acceso:', error);
    res.status(500).json({ mensaje: 'Error al quitar acceso' });
  }
}

const agregarEmpledo = async (req, res) => {
  try {
    const { nombre, email, telefono, userId } = req.body;

    // Verificar si el usuario (empleador) existe
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si ya existe un empleado con ese email
    const empleadoExistente = await Empleado.findOne({ email });
    if (empleadoExistente) {
      return res.status(400).json({ mensaje: 'Ya existe un empleado con ese email' });
    }

    // Crear nuevo empleado
    const nuevoEmpleado = new Empleado({
      nombre,
      email,
      telefono,
      usuario: userId
    });

    await nuevoEmpleado.save();

    res.status(201).json({
      mensaje: 'Empleado agregado con éxito',
      empleado: {
        id: nuevoEmpleado._id,
        nombre: nuevoEmpleado.nombre,
        email: nuevoEmpleado.email,
        telefono: nuevoEmpleado.telefono
      }
    });
  } catch (error) {
    console.error('Error al agregar empleado:', error);
    res.status(500).json({ mensaje: 'Error al agregar empleado' });
  }
}


module.exports = {
  comprarPaquete,
  getPaquetePorUsuario,
  updateLocation,
  paquetesRfid,
  empleadosConAcceso,
  getAllEmpleados,
  agregarEmpledo, 
  quitarAcceso,
  darAcceso
};
