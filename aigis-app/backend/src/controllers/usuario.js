// Importar model
const { Usuario } = require('../models/model.js');

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: 'Mensaje enviado desde: controllers/user.js'
    });
};

// Registrar usuarios
const signup = async (req, res) => {
    try {
        // Recoger datos de la petición
        let params = req.body;

        // Comprobar que me llegaron bien
        if (!params.nombre || !params.correo || !params.contrasena || !params.rol || !params.direccion || !params.telefono || !params.giro) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Crear objeto de usuario
        let usuario = new Usuario(params);

        // Control de usuarios duplicados
        const usuarios = await Usuario.find({
            correo: usuario.correo.toLowerCase(),
        });

        if (usuarios.length >= 1) {
            return res.status(500).json({
                status: "success",
                message: "El correo ya esta en uso"
            });
        }

        // Guardar usuario en la BD
        const usuarioRegistrado = await usuario.save();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            message: 'Se registró el usuario',
            usuario: usuarioRegistrado
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        let params = req.body;

        // Verificar que se enviaron los datos requeridos
        if (!params.correo || !params.contrasena) {
            return res.status(400).json({ status: "error", message: "Faltan datos por enviar" });
        }

        // Buscar al usuario por correo
        const foundUser = await Usuario.find({ correo: params.correo });

        // Verificar si el usuario existe
        if (foundUser.length === 0) {
            return res.status(404).json({ status: "error", message: "El usuario no existe" });
        }

        // Verificar la contraseña (deberías hashear y comparar en producción)
        const user = foundUser[0];
        if (params.contrasena !== user.contrasena) {
            return res.status(401).json({ status: "error", message: "Contraseña incorrecta" });
        }

        const { _id } = user;

        // Convertir el ObjectId a una cadena, si es necesario
        const userIdString = _id.toString();
        
        console.log(userIdString);
        
        req.userId = userIdString;
        // Devolver respuesta exitosa
        return res.status(200).json({ status: "success", message: "Acción de login", user});

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el proceso de login",
            error: error.message
        });
    }
};


// Exportar acciones
module.exports = {
    pruebaUser,
    signup,
    login
};
