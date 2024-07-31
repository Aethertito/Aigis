const { Pago, Usuario, Membresia, Paquete } = require('../models/model.js');
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
    console.log('Pago guardado correctamente');
    
    const usuario = await Usuario.findById(usuario_id);
        if (!usuario) {
            console.error('User not found');
            return res.status(404).json({ status: "error", message: "User not found" });
        }
    
    const membresiaObjectId = membresia_id ? new mongoose.Types.ObjectId(membresia_id) : null;
    
        if (membresiaObjectId) {
            const membresia = await Membresia.findById(membresiaObjectId);
            if (!membresia) {
            console.error('Membership not found');
            return res.status(404).json({ status: "error", message: "Membership not found" });
            }
    
            usuario.membresia = membresiaObjectId;
            usuario.memCantidad = membresia.cantidad;
            usuario.memPeriodo = membresia.periodo;
            usuario.memDescripcion = membresia.descripcion;
            usuario.memActiva = true;
    
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setMonth(fechaFin.getMonth() + membresia.cantidad);
    
            usuario.memFechaInicio = fechaInicio;
            usuario.memFechaFin = fechaFin;
    
            console.log('Fecha de inicio de membresía:', fechaInicio);
            console.log('Fecha de fin de membresía:', fechaFin);
            console.log('Campo memActiva actualizado a true');
        }
    
        if (paquete_id) {
            usuario.paqSelect = paquete_id ? [{ paquete_id: new mongoose.Types.ObjectId(paquete_id), cantidad: 1 }] : usuario.paqSelect;
        }
    
        await usuario.save();
        console.log('Usuario actualizado correctamente');
    
        return res.status(200).json({ status: "success", message: "Payment created successfully", pago });
        } catch (error) {
        console.error('Error creating payment', error);
        return res.status(500).json({ status: "error", message: "Error creating payment", error: error.message });
        }
}

const getMemPagos = async (req, res) => {
    try {
        const pagos = await Usuario.find({ rol: 'user' }).populate('membresia');
        return res.status(200).json({
            status: "success",
            pagos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving payments",
            error: error.message
        });
    }
};
const getPaqPagos = async (req, res) => {
    try {
        const pagos = await Usuario.find({ rol: 'user' }).populate('paqSelect.paquete_id');
        return res.status(200).json({
            status: "success",
            pagos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving package payments",
            error: error.message
        });
    }
};

module.exports = {
    pago,
    getMemPagos,
    getPaqPagos
};
