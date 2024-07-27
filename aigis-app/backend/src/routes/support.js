// src/routes/support.js

const express = require('express');
const router = express.Router();
const { deleteSupportComment } = require('../controllers/supportComment');

// Endpoint para eliminar un comentario de soporte
router.delete('/comment/:id', deleteSupportComment);

module.exports = router;
