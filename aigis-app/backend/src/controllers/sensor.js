const path = require('path');
const { Sensor } = require('../models/model.js');
const fs = require('fs');

const getSensor = async (req, res) => {
    try {
        const sensores = await Sensor.find();
        return res.status(200).json({
            status: "success",
            sensores
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving sensors",
            error: error.message
        });
    }
};

// Controller to add a new sensor
const postSensor = async (req, res) => {
    try {
        const { tipo, precio, descripcion, estado } = req.body;
        let imagen = null;

        if (!tipo || !precio || !descripcion) {
            return res.status(400).json({
                status: "error",
                message: "Missing data"
            });
        }

        if (req.file) {
            imagen = `${req.file.filename}`;
        }

        let sensor = new Sensor({
            tipo,
            precio,
            descripcion,
            imagen,
            estado: estado || 'inactive'
        });

        const sensores = await Sensor.find({ tipo: sensor.tipo });

        if (sensores.length >= 1) {
            return res.status(500).json({
                status: "error",
                message: "Sensor already exists"
            });
        }

        const sensorSaved = await sensor.save();

        return res.status(200).json({
            status: "success",
            message: 'Sensor registered successfully',
            sensor: sensorSaved
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error registering sensor",
            error: error.message
        });
    }
};

const mostrarImagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = './assets/img/' + fichero;
    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            console.log('Error showing image');
        }
    });
    return;
};

const updateSensor = async (req, res) => {
    try {
        const sensorId = req.params.id;
        const updateData = req.body;

        const sensorUpdated = await Sensor.findByIdAndUpdate(sensorId, updateData, { new: true });

        if (!sensorUpdated) {
            return res.status(404).json({
                status: "error",
                message: "Sensor not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Sensor updated successfully",
            sensor: sensorUpdated
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error updating sensor",
            error: error.message
        });
    }
};

const deleteSensor = async (req, res) => {
    try {
        const sensorId = req.params.id;

        const sensorDeleted = await Sensor.findByIdAndDelete(sensorId);

        if (!sensorDeleted) {
            return res.status(404).json({
                status: "error",
                message: "Sensor not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Sensor deleted successfully",
            sensor: sensorDeleted
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error deleting sensor",
            error: error.message
        });
    }
};

module.exports = {
    getSensor,
    postSensor,
    updateSensor,
    deleteSensor,
    mostrarImagen
};
