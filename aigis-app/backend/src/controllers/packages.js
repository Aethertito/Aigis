const { Paquete } = require('../models/model.js')

const getPackage = async (req, res) => {
    try {
        const paquetes = await Paquete.find()
        return res.status(200).json({
            status: "success",
            paquetes
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los sensores",
            error: error.message
        })
    }
}
module.exports = {
    getPackage
};
