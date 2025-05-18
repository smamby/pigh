// backend/routes/alojamientos.routes.js
const express = require('express');
const router = express.Router();
const alojamientoController = require('../controllers/alojamiento.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware'); // Importar middlewares

// --- Rutas Públicas (o para usuarios autenticados en general) ---
// GET /api/alojamientos - Listar todos los alojamientos (con filtros opcionales por query params)
router.get('/', alojamientoController.getAllAlojamientos);

// GET /api/alojamientos/:id - Obtener un alojamiento específico por ID
router.get('/:id', alojamientoController.getAlojamientoById);

// --- Rutas Protegidas (solo para administradores) ---
// POST /api/alojamientos - Crear un nuevo alojamiento
router.post('/', authenticateToken, isAdmin, alojamientoController.createAlojamiento);

// PUT /api/alojamientos/:id - Actualizar un alojamiento existente
router.put('/:id', authenticateToken, isAdmin, alojamientoController.updateAlojamiento);

// DELETE /api/alojamientos/:id - Eliminar un alojamiento
router.delete('/:id', authenticateToken, isAdmin, alojamientoController.deleteAlojamiento);

module.exports = router;