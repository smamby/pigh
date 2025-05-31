const express = require('express');
const router = express.Router();
const caracteristicaController = require('../controllers/caracteristica.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware'); // Importar middlewares


// Public routes
router.get('/', caracteristicaController.getAll);
router.get('/search/:id', caracteristicaController.getCaracteristicaByalojamiento);
router.get('/:id', caracteristicaController.getById);

// Admin-only routes
router.post('/', authenticateToken, isAdmin, caracteristicaController.create);
router.put('/:id', authenticateToken, isAdmin, caracteristicaController.update);
router.delete('/:id', authenticateToken, isAdmin, caracteristicaController.delete);

module.exports = router;