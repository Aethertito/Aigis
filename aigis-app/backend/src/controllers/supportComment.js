// src/controllers/supportComment.js

const AyudaUsuario = require('../models/model').AyudaUsuario;

const deleteSupportComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await AyudaUsuario.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Support comment not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Support comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting support comment:', error);
    res.status(500).json({ message: 'Failed to delete support comment' });
  }
};

module.exports = { deleteSupportComment };
