// backend/models/usuario.model.js

const db = require('../db'); // Importa la conexión a la BD (el pool.promise())
const bcrypt = require('bcryptjs');

const Usuario = {};

// Crear un nuevo usuario
Usuario.create = async (nuevoUsuario) => {
  const { nombre, apellido, email, password, es_admin } = nuevoUsuario;

  // Hashear la contraseña antes de guardarla
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, apellido, email, password, es_admin) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, hashedPassword, es_admin || false] // Si no se provee es_admin, por defecto es false
    );
    return { id: result.insertId, nombre, apellido, email, es_admin };
  } catch (error) {
    // Manejar error de email duplicado (ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El correo electrónico ya está registrado.');
    }
    throw error; // Re-lanzar otros errores
  }
};

// Encontrar un usuario por su email
Usuario.findByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null; // Retorna null si no se encuentra el usuario
  } catch (error) {
    throw error;
  }
};

// Encontrar un usuario por su ID
Usuario.findById = async (id) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, apellido, email, es_admin, fecha_registro FROM usuarios WHERE id = ?', [id]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Comparar contraseña (útil para el login)
Usuario.comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = Usuario;