const mongoose = require('mongoose')
const {config} = require('dotenv')
config()

const connection = async() => {
    try {
        await mongoose.connect('mongodb+srv://aigis:passwordAIGIS@clusteraigis.2tqlsap.mongodb.net/aigis2')

        console.log('Conectado correctamente a AIGIS BD')
    } catch (error) {
        console.log(error)
        throw new Error('No se ha podido conectar a la base de datos !!')
    }
}

module.exports = connection