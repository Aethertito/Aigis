    // Import model
    const { Usuario, AyudaUsuario } = require('../models/model.js');

    // Register users
    const signup = async (req, res) => {
        try {
            // Collect data from the request
            let params = req.body;

            // Check that all required data is provided
            if (!params.nombre || !params.correo || !params.contrasena || !params.rol || !params.direccion || !params.telefono || !params.giro) {
                return res.status(400).json({
                    status: "error",
                    message: "Missing data to submit"
                });
            }

            // Create a user object
            let usuario = new Usuario({
                nombre: params.nombre,
                correo: params.correo,
                contrasena: params.contrasena,
                rol: params.rol,
                direccion: params.direccion,
                telefono: params.telefono,
                giro: params.giro,
                membresia: null, // Inicialmente null
                memActiva: false, // Inicialmente false
                memFechaInicio: null, // Inicialmente null
                memFechaFin: null, // Inicialmente null
                paqSelect: [], // Inicialmente vacío
                sensores: [] // Inicialmente vacío
            });

            // Check for duplicate users
            const usuarios = await Usuario.find({
                correo: usuario.correo.toLowerCase(),
            });

            if (usuarios.length >= 1) {
                return res.status(500).json({
                    status: "error",
                    message: "Email is already in use"
                });
            }

            // Save user to the database
            const usuarioRegistrado = await usuario.save();

            // Return result
            return res.status(200).json({
                status: "success",
                message: 'User registered successfully',
                usuario: usuarioRegistrado
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error registering user",
                error: error.message
            });
        }
    };

    const login = async (req, res) => {
        try {
            let params = req.body;

            // Check that all required data is provided
            if (!params.correo || !params.contrasena) {
                return res.status(400).json({
                    status: "error",
                    message: "Missing data to submit"
                });
            }

            // Find user by email
            const foundUser = await Usuario.find({ correo: params.correo });

            // Check if user exists
            if (foundUser.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "User does not exist"
                });
            }

            // Verify password (should hash and compare in production)
            const user = foundUser[0];
            if (params.contrasena !== user.contrasena) {
                return res.status(401).json({
                    status: "error",
                    message: "Incorrect password"
                });
            }

            const { _id } = user;

            // Convert ObjectId to string if necessary
            const userIdString = _id.toString();
            
            console.log(userIdString);
            
            req.userId = userIdString;
            // Return successful response
            return res.status(200).json({
                status: "success",
                message: "Login successful",
                user,
                _id
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error during login process",
                error: error.message
            });
        }
    };

    const getUsuario = async (req,res) => {
        const userId = req.params.userId

        try {
            const user = await Usuario.findById(userId)

            if(!user){
                return res.status(404).json({message: 'Usuario no encontrado'})
            }

            res.status(200).json(user)
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Erro del servidor'})
        }
    }

    const getAllUser = async (req, res) => {
        try {
            const users = await Usuario.find({ rol: 'user' });
            return res.status(200).json({
                status: "success",
                users
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error retrieving users",
                error: error.message
            });
        }
    };

    const updateUser = async (req, res) => {
        try {
            const userId = req.params.userId;
            const updateData = req.body;

            const userUpdated = await Usuario.findByIdAndUpdate(userId, updateData, { new: true });

            if (!userUpdated) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "User updated successfully",
                usuario: userUpdated
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error updating user",
                error: error.message
            });
        }
    }

    const deleteUser = async (req, res) => {
        try {
            const userId = req.params.userId;

            const userDeleted = await Usuario.findByIdAndDelete(userId);

            if (!userDeleted) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "User deleted successfully",
                usuario: userDeleted
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error deleting user",
                error: error.message
            });
        }
    };

const helpUser = async (req, res) => {
    try {
        const { correo, titulo, problema } = req.body;

        // Find the user based on the email
        const user = await Usuario.findOne({ correo: correo });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        // Create a new help request
        let ayudaUsuario = new AyudaUsuario({
            correo,
            titulo,
            problema,
            usuario_id: user._id,
        });

        // Save the help request to the database
        const helpRequestSaved = await ayudaUsuario.save();

        // Return result
        return res.status(200).json({
            status: "success",
            message: 'Help request submitted successfully',
            ayudaUsuario: helpRequestSaved
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error submitting help request",
            error: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const supportComments = await AyudaUsuario.find().populate('usuario_id', 'nombre correo');
        return res.status(200).json({
            status: "success",
            supportComments
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving support comments",
            error: error.message
        });
    }
};
// Obtener historial de soporte de un usuario
const getSupportHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const supportRequests = await AyudaUsuario.find({ usuario_id: userId }).sort({ fecha: -1 });

        if (!supportRequests) {
            return res.status(404).json({
                status: "error",
                message: "Support requests not found"
            });
        }

        return res.status(200).json({
            status: "success",
            supportRequests
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error retrieving support history",
            error: error.message
        });
    }
};


    // Export actions
module.exports = {
    signup,
    login,
    getUsuario,
    updateUser,
    getAllUser,
    deleteUser,
    helpUser,
    getComments,
    getSupportHistory
};
