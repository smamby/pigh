// routes.js (en la raíz de tu proyecto)

const express = require('express');
const router = express.Router(); // Creamos un router principal para agrupar todas las sub-rutas

// Importar todas las rutas individuales
const authRoutes = require('./routes/auth.routes');
const alojamientosRoutes = require('./routes/alojamientos.routes');
const tipo_alojamientosRoutes = require('./routes/tipo_alojamientos.routes');
const img_alojamientosRoutes = require('./routes/img_alojamientos.routes');
const reservasRoutes = require('./routes/reservas.routes');
const caracteristicasRoutes = require('./routes/caracteristicas.routes');
const puntajeRoutes = require('./routes/puntajes.routes'); 
const habitacionRoutes = require('./routes/habitaciones.routes');

// Montar cada conjunto de rutas bajo su respectivo prefijo de API
router.use('/auth', authRoutes);
router.use('/alojamientos', alojamientosRoutes);
router.use('/tipo_alojamientos', tipo_alojamientosRoutes);
router.use('/reservas', reservasRoutes);
router.use('/img_alojamientos', img_alojamientosRoutes);
router.use('/caracteristicas', caracteristicasRoutes);
router.use('/puntajes', puntajeRoutes);
router.use('/habitaciones', habitacionRoutes);

module.exports = router; // Exportamos el router principal