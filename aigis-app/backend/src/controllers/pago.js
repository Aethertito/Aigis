const { Pago } = require('../models/model.js');
const { Usuario } = require('../models/model.js');

async function pago(req, res) {
    const { usuario_id, membresia_id, paquete_id, monto, metodo_pago, estado } = req.body;

    try {
        const pago = new Pago({
            usuario_id,
            membresia_id,
            paquete_id,
            monto,
            metodo_pago,
            estado
        });

        await pago.save();

        // Actualizar el usuario con la membresía y paquete seleccionados
        const usuario = await Usuario.findById(usuario_id);
        if (!usuario) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }

        // Actualizar datos de membresía y paquete
        usuario.membresia = membresia_id;
        usuario.paquete = paquete_id;

        // Establecer la membresía como activa
        usuario.memActiva = true;


        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1); 

        usuario.memFechaInicio = fechaInicio;
        usuario.memFechaFin = fechaFin;

        await usuario.save();

        return res.status(200).json({ status: "success", message: "Pago creado correctamente", pago });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error al crear el pago", error: error.message });
    }
}

module.exports = {
    pago
};
