// backend/db.js

const mysql = require('mysql2');
require('dotenv').config(); // Carga las variables de entorno desde .env

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión (opcional, pero recomendado)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Conexión con la base de datos perdida.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Demasiadas conexiones a la base de datos.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Conexión a la base de datos rechazada. Verifica que el servidor MySQL esté corriendo y las credenciales sean correctas.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Acceso denegado a la base de datos. Verifica el usuario y contraseña.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('La base de datos no existe:', process.env.DB_DATABASE);
    }
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL como id ' + connection.threadId);
  connection.release(); // Liberar la conexión
});

// Exportar el pool para poder usarlo en otros módulos
module.exports = pool.promise(); // Usamos .promise() para poder usar async/await con las consultas