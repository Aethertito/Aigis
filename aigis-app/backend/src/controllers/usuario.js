// Import model
const { Usuario } = require('../models/model.js');

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
        let usuario = new Usuario(params);

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

const getUsuario = async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;
  
    try {
      const user = await Usuario.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Actualizar solo los campos que están presentes en el cuerpo de la solicitud
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null && updates[key] !== '') {
          user[key] = updates[key];
        }
      });
  
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };

const getAllUser = async (req, res) => {
    try {
        const users = await Usuario.find();
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
        const userId = req.params.id;

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

// Export actions
module.exports = {
    signup,
    login,
    getUsuario,
    updateUser,
    getAllUser,
    deleteUser
};
