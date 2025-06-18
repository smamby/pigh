const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/alojamiento/:id', habitacionController.getByAlojamiento);
router.get('/:id', habitacionController.getById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, isAdmin, habitacionController.create);
router.put('/:id', authenticateToken, isAdmin, habitacionController.update);
router.delete('/:id', authenticateToken, isAdmin, habitacionController.delete);

module.exports = router;