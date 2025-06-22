// backend/routes/reservas.routes.js

const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller.js');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// --- Rutas para Usuarios Autenticados ---

// POST /api/reservas - Crear una nueva reserva
router.post('/', authenticateToken, reservaController.createReserva);

// GET /api/reservas/mis-reservas - Listar las reservas del usuario autenticado
router.get('/mis-reservas/', authenticateToken, reservaController.getMisReservas);

// GET /api/reservas/mis-reservas - Listar las reservas del alojamiento
router.get('/mis-reservas/alojamiento/:id', authenticateToken, reservaController.getReservasAlojamiento);

// GET /api/reservas/mis-reservas/:id - Obtener detalle de una reserva específica del usuario autenticado
router.get('/mis-reservas/:id', authenticateToken, reservaController.getMiReservaById);

// PATCH /api/reservas/mis-reservas/:id/cancelar - Cancelar una reserva del usuario autenticado
router.patch('/mis-reservas/:id/cancelar', authenticateToken, reservaController.cancelarMiReserva);


// --- Rutas para Administradores ---

// GET /api/reservas/admin/all - Listar todas las reservas (Admin)
router.get('/admin/all', authenticateToken, isAdmin, reservaController.getAllReservasAdmin);

// GET /api/reservas/admin/:id - Obtener detalle de cualquier reserva por ID (Admin)
router.get('/admin/:id', authenticateToken, isAdmin, reservaController.getReservaByIdAdmin);

// PATCH /api/reservas/admin/:id/status - Actualizar estado de cualquier reserva (Admin)
router.patch('/admin/:id/status', authenticateToken, isAdmin, reservaController.updateReservaStatusAdmin);


module.exports = router;