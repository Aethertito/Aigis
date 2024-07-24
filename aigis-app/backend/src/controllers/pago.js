const { Pago, Usuario, Membresia } = require('../models/model.js');
const mongoose = require('mongoose');

async function pago(req, res) {
    const { usuario_id, membresia_id, paquete_id, monto, metodoPago, estado } = req.body;

    console.log('Datos recibidos:', req.body); // Log para verificar los datos recibidos

    try {
        const pago = new Pago({
            usuario_id,
            membresia_id,
            paquete_id,
            monto,
            metodoPago,
            estado
        });

        await pago.save();
        console.log('Pago guardado correctamente'); // Log para confirmar que el pago se guardó

        // Actualizar el usuario con la membresía y paquete seleccionados
        const usuario = await Usuario.findById(usuario_id);
        if (!usuario) {
            console.error('Usuario no encontrado'); // Log para usuario no encontrado
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }

        // Convertir membresia_id a ObjectId si está presente
        const membresiaObjectId = membresia_id ? new mongoose.Types.ObjectId(membresia_id) : null;

        // Obtener la membresía para calcular la fecha de finalización y actualizar los campos adicionales si membresia_id está presente
        if (membresiaObjectId) {
            const membresia = await Membresia.findById(membresiaObjectId);
            if (!membresia) {
                console.error('Membresía no encontrada'); // Log para membresía no encontrada
                return res.status(404).json({ status: "error", message: "Membresía no encontrada" });
            }

            // Actualizar datos de membresía en el usuario
            usuario.membresia = membresiaObjectId;
            usuario.memCantidad = membresia.cantidad;
            usuario.memPeriodo = membresia.periodo;
            usuario.memDescripcion = membresia.descripcion;
            usuario.memActiva = true; // Establecer la membresía como activa

            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setMonth(fechaFin.getMonth() + membresia.cantidad); // Ajustar la fecha según la duración de la membresía

            usuario.memFechaInicio = fechaInicio;
            usuario.memFechaFin = fechaFin;

            console.log('Fecha de inicio de membresía:', fechaInicio);
            console.log('Fecha de fin de membresía:', fechaFin);
            console.log('Campo memActiva actualizado a true');
        }

        // Actualizar datos del paquete si paquete_id está presente
        if (paquete_id) {
            usuario.paqSelect = paquete_id ? [{ paquete_id: new mongoose.Types.ObjectId(paquete_id), cantidad: 1 }] : usuario.paqSelect;
        }

        await usuario.save();
        console.log('Usuario actualizado correctamente'); // Log para confirmar que el usuario se actualizó

        return res.status(200).json({ status: "success", message: "Pago creado correctamente", pago });
    } catch (error) {
        console.error('Error al crear el pago:', error); // Log para cualquier error durante el proceso
        return res.status(500).json({ status: "error", message: "Error al crear el pago", error: error.message });
    }
}

module.exports = {
    pago
};
