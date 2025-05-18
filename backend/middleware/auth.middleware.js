// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acceder a JWT_SECRET
const Usuario = require('../models/usuario.model'); // Para verificar si el usuario aún existe y es admin

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Authorization: Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedTokenPayload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Token inválido.' });
      }
      return res.status(403).json({ message: 'Error al verificar el token.', error: err.message });
    }

    // El token es válido, adjuntar payload al request para uso posterior
    // El payload contiene { id, email, es_admin } que definimos al firmar el token
    req.user = decodedTokenPayload;
    next(); // Continuar al siguiente middleware o al controlador
  });
};

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
  // Este middleware debe usarse DESPUÉS de authenticateToken,
  // por lo que req.user debería estar disponible.
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'No autenticado. No se puede verificar el rol de administrador.' });
  }

  try {
    // Opcional pero recomendado: verificar en la BD que el usuario sigue existiendo y sigue siendo admin,
    // ya que el token podría ser antiguo y el estado del usuario haber cambiado.
    const usuario = await Usuario.findById(req.user.id);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario del token no encontrado en la base de datos.' });
    }

    if (!usuario.es_admin) { // O req.user.es_admin si confías solo en el payload del token.
                            // Usar usuario.es_admin es más seguro por si el rol cambió.
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    next(); // El usuario es admin, continuar
  } catch (error) {
    console.error("Error en middleware isAdmin:", error);
    res.status(500).json({ message: "Error interno del servidor al verificar el rol de administrador." });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};