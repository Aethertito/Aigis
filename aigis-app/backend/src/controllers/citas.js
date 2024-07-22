const { Cita } = require('../models/model.js')

const createCita = async (req, res) => {
    try {

        console.log(req.body)

        
        let params = req.body
        
        if (!params.fecha || !params.hora || !params.colonia || !params.calle || !params.numero || !params.referencia) {
            return res.status(400).json({
                status: 'error',
                message: 'Complete todos los campos'
            })
        }
        
        let cita = new Cita(params)
        console.log(params)

        const existeCita = await Cita.find({
            fecha: cita.fecha
        })

        if (existeCita.length >= 1) {
            return res.status(500).json({
                status: 'error',
                message: 'Ya existe una cita con esa fecha'
            })
        }

        const saveCita = await cita.save()

        return res.status(200).json({
            status: 'success',
            message: 'Se guardo la cita',
            saveCita
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar cita',
            error: error.message
        })
    }

}

module.exports = {
    createCita
}