// routes/tipo_alojamientos.routes.js
const express = require('express');
const router = express.Router();
const tipoAlojamientoController = require('../controllers/tipo_alojamiento.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware'); // Importar middlewares

// --- Rutas Públicas (o para usuarios autenticados en general) ---
// GET /api/tipo_alojamientos - Listar todos los alojamientos (con filtros opcionales por query params)
router.get('/', tipoAlojamientoController.getAllTipoAlojamientos);

// GET /api/tipo_alojamientos/destinations - Obtener lista de destinos (ciudades) disponibles (con filtros opcionales por query params)
//router.get('/destinos', tipoAlojamientoController.destinos);

// GET /api/tipo_alojamientos/:id - Obtener un alojamiento específico por ID
router.get('/:id', tipoAlojamientoController.getTipoAlojamientoById);

// --- Rutas Protegidas (solo para administradores) ---
// POST /api/tipo_alojamientos - Crear un nuevo alojamiento
router.post('/', authenticateToken, isAdmin, tipoAlojamientoController.createTipoAlojamiento);

// PUT /api/tipo_alojamientos/:id - Actualizar un alojamiento existente
router.put('/:id', authenticateToken, isAdmin, tipoAlojamientoController.updateTipoAlojamiento);

// DELETE /api/tipo_alojamientos/:id - Eliminar un alojamiento
router.delete('/:id', authenticateToken, isAdmin, tipoAlojamientoController.deleteTipoAlojamiento);

module.exports = router;