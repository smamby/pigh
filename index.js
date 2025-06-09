// index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./db');
const apiRoutes = require('./routes');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', apiRoutes);

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