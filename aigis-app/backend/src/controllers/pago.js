const { Pago, Usuario } = require('../models/model.js');

async function pago(req, res) {
    const { usuarioId, membresiaId, paqueteId, monto, metodoPago } = req.body;

    try {
        const pago = new Pago({
            usuario_id: usuarioId,
            membresia_id: membresiaId,
            paquete_id: paqueteId,
            monto: monto,
            fecha: new Date(),
            metodo_pago: metodoPago,
            estado: 'completado' // Estado completado
        });

        await pago.save();

        // Actualizar el usuario con la membresía y paquete seleccionados
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }

        // Actualizar datos de membresía y paquete
        usuario.membresia = membresiaId;
        usuario.paquete = paqueteId;

        // Establecer la membresía como activa
        usuario.membresia_activa = true;

        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1); 

        usuario.fecha_inicio_membresia = fechaInicio;
        usuario.fecha_fin_membresia = fechaFin;

        await usuario.save();

        return res.status(200).json({ status: "success", message: "Pago creado correctamente", pago });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error al crear el pago", error: error.message });
    }
}

module.exports = {
    pago
};
