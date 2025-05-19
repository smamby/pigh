// backend/controllers/auth.controller.js

const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para acceder a JWT_SECRET

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, es_admin } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios (nombre, apellido, email, password).' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Verificar si el email ya existe (aunque el modelo también lo hace, es bueno tener una verificación temprana)
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const nuevoUsuario = await Usuario.create({ nombre, apellido, email, password, es_admin }); // es_admin es opcional en el body

    // No enviar la contraseña hasheada en la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;


    // Opcional: generar un token JWT inmediatamente después del registro
    const token = jwt.sign(
      { id: usuarioSinPassword.id, email: usuarioSinPassword.email, es_admin: usuarioSinPassword.es_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora (puedes ajustarlo)
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: usuarioSinPassword,
      token // Enviar el token al cliente
    });

  } catch (error) {
    // Si el error es el que lanzamos desde el modelo por email duplicado
    if (error.message === 'El correo electrónico ya está registrado.') {
        return res.status(409).json({ message: error.message });
    }
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.', error: error.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Email no encontrado
    }

    const isMatch = await Usuario.comparePassword(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Contraseña incorrecta
    }

    // Si las credenciales son correctas, generar un token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, es_admin: usuario.es_admin }, // Payload del token
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora (puedes ajustarlo)
    );

    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: usuarioSinPassword // Opcional: enviar datos del usuario
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor durante el inicio de sesión.', error: error.message });
  }
};

// Opcional: Obtener el perfil del usuario actual (requiere token)
exports.getMe = async (req, res) => {
    // El middleware de autenticación (que crearemos más adelante)
    // habrá añadido req.user con los datos del token decodificado.
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado." });
    }

    try {
        // Buscamos al usuario en la BD para tener la info más actualizada (excepto el password)
        const usuario = await Usuario.findById(req.user.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        // No es necesario enviar la contraseña. findById ya la omite.
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};