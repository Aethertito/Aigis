const path = require('path');
const { Sensor, Usuario, PaqueteComprado } = require('../models/model.js');
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

const getSensorByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const usuario = await Usuario.findById(userId).populate('sensores.sensor_id');

        if (!usuario) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const sensores = usuario.sensores.map(sensor => ({
            sensor_id: sensor.sensor_id._id,
            tipo: sensor.sensor_id.tipo,
            descripcion: sensor.sensor_id.descripcion,
            estado: sensor.sensor_id.estado,
            ubicacion: sensor.sensor_id.ubicacion
        }));

        return res.status(200).json({ status: "success", sensores });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving user's sensors",
            error: error.message
        });
    }
};

const updateSensorStatus = async (req, res) => {
    try {
        const sensorId = req.params.id;
        const sensor = await Sensor.findById(sensorId);

        if (!sensor) {
            return res.status(404).json({
                status: "error",
                message: "Sensor not found"
            });
        }

        sensor.estado = sensor.estado === 'active' ? 'inactive' : 'active';
        const updatedSensor = await sensor.save();

        return res.status(200).json({
            status: "success",
            message: `Sensor ${sensor.estado === 'active' ? 'activated' : 'deactivated'} successfully`,
            sensor: updatedSensor
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error updating sensor status",
            error: error.message
        });
    }
};

const getTemperatureLocation = async (req, res) => {
    try {
        const userId = req.query.userId; // Obtener el userId de la solicitud

        // Obtener todos los paquetes comprados con los sensores asociados para el usuario específico
        const paquetesComprados = await PaqueteComprado.find({ usuario: userId }).populate('sensores.sensor_id');

        // Filtrar y agrupar sensores de "Temperature and Humidity" por ubicación
        const sensoresAgrupadosPorUbicacion = paquetesComprados.reduce((acc, paquete) => {
            const ubicacion = paquete.ubicacion || 'Unspecified';
            const sensoresDeTemperatura = paquete.sensores.filter(sensor => sensor.tipo === 'Temperature and Humidity');

            if (sensoresDeTemperatura.length > 0) {
                if (!acc[ubicacion]) {
                    acc[ubicacion] = [];
                }
                acc[ubicacion].push(...sensoresDeTemperatura.map(sensor => ({
                    sensor_id: sensor.sensor_id._id,
                    tipo: sensor.sensor_id.tipo,
                    descripcion: sensor.sensor_id.descripcion,
                    estado: sensor.sensor_id.estado,
                    ubicacion: paquete.ubicacion
                })));
            }

            return acc;
        }, {});

        return res.status(200).json({ status: "success", sensores: sensoresAgrupadosPorUbicacion });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: "error",
            message: "Error retrieving temperature sensors by location",
            error: error.message
        });
    }
};


module.exports = {
    getSensor,
    postSensor,
    updateSensor,
    deleteSensor,
    mostrarImagen,
    getSensorByUser,
    updateSensorStatus,
    getTemperatureLocation
};
