const { Cita } = require('../models/model.js')

const createCita = async (req, res) => {
    try {
        console.log(req.body)

        let params = req.body
        
        if (!params.fecha || !params.hora || !params.colonia || !params.calle || !params.numero || !params.referencia || !params.motivo) {
            return res.status(400).json({
                status: 'error',
                message: 'Complete all fields'
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
                message: 'There is already an appointment with that date'
            })
        }

        const saveCita = await cita.save()

        return res.status(200).json({
            status: 'success',
            message: 'The appointment was saved',
            saveCita
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error saving appointment',
            error: error.message
        })
    }
}

const getAllCitas = async (req,res) => {
    const citas = await Cita.find().populate('usuario_id')
    return res.json(citas)
}

const confirmCita = async (req,res) => {
    try {
        const { id } = req.params;
        const updatedCita = await Cita.findByIdAndUpdate(id, { estado: 'Confirm' }, { new: true });

        if (!updatedCita) {
            return res.status(404).json({ message: 'Cita not found' });
        }

        res.status(200).json({
            status: 'success',
            data: updatedCita,
        });
    } catch (error) {
        console.error('Error updating cita:', error);
        res.status(500).json({ message: 'Failed to update cita' });
    }
}

const attendCita = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCita = await Cita.findByIdAndUpdate(id, { estado: 'attended' }, { new: true });

        if (!updatedCita) {
            return res.status(404).json({ message: 'Cita not found' });
        }

        res.status(200).json({
            status: 'success',
            data: updatedCita,
        });
    } catch (error) {
        console.error('Error updating cita:', error);
        res.status(500).json({ message: 'Failed to update cita' });
    }
}

module.exports = {
    createCita,
    getAllCitas,
    confirmCita,
    attendCita
}
