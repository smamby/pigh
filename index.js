// index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db');

// Importar rutas
const alojamientosRoutes = require('./routes/alojamientos.routes');
const tipo_alojamientosRoutes = require('./routes/tipo_alojamientos.routes');
const img_alojamientosRoutes = require('./routes/img_alojamientos.routes');
const authRoutes = require('./routes/auth.routes');
const reservasRoutes = require('./routes/reservas.routes');
const caracteristicasRoutes = require('./routes/caracteristicas.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/alojamientos', alojamientosRoutes);
app.use('/api/tipo_alojamientos', tipo_alojamientosRoutes);
app.use('/api/reservas', reservasRoutes); 
app.use('/api/img_alojamientos', img_alojamientosRoutes);
app.use('/api/caracteristicas', caracteristicasRoutes);

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ success: true, message: 'Conexión a la BD exitosa y consulta de prueba realizada.', data: rows[0] });
  } catch (error) {
    console.error('Error al probar la conexión a la BD:', error);
    res.status(500).json({ success: false, message: 'Error al conectar con la BD.', error: error.message });
  }
});

app.get('/api', (req, res) => {
  res.send('¡Bienvenido a la API de Booking MVP!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});