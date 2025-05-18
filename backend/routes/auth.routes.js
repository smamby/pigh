// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// const { authenticateToken } = require('../middleware/auth.middleware'); // Lo crearemos luego

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ejemplo de ruta protegida (la descomentaremos y probaremos cuando tengamos el middleware)
// router.get('/me', authenticateToken, authController.getMe);

module.exports = router;