// routes/puntajes.routes.js

const express = require('express');
const router = express.Router();
const puntajeController = require('../controllers/puntaje.controller'); // Ruta correcta

// Rutas para Puntajes
router.get('/', puntajeController.getAllPuntajes);        // Obtener todos los puntajes (o filtrar por idAlojamiento)
router.get('/alojamiento/:idAlojamiento', puntajeController.getPuntajesByAlojamientoId);
router.get('/:id', puntajeController.getPuntajeById);      // Obtener puntaje por ID de puntaje
router.post('/', puntajeController.addPuntaje);          // Crear nuevo puntaje
router.put('/:id', puntajeController.updatePuntaje);     // Actualizar puntaje
router.delete('/:id', puntajeController.deletePuntaje);  // Eliminar puntaje

module.exports = router;