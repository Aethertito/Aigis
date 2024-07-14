const { Membresia } = require('../models/model.js')

const getMembership = async (req, res) => {
    try {
        const membresias = await Membresia.find()
        return res.status(200).json({
            status: "success",
            membresias
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
    getMembership
};
