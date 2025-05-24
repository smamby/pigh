// controllers/tipo_alojamiento.controller.js

const tipoAlojamiento = require('../models/tipo_alojamiento.model');


// Obtener todos los tipos de alojamiento
exports.getAllTipoAlojamientos = async (req, res) => {
  try {
    const filtros = { ...req.query };
    const tipos = await tipoAlojamiento.getAll(filtros);
    res.status(200).json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de alojamiento:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener los tipos de alojamiento.',
      error: error.message 
    });
  }
};

// Obtener un tipo de alojamiento por ID
exports.getTipoAlojamientoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID debe ser un número válido.' 
      });
    }

    const tipo = await tipoAlojamiento.findById(id);
    if (!tipo) {
      return res.status(404).json({ 
        message: 'Tipo de alojamiento no encontrado.' 
      });
    }

    res.status(200).json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de alojamiento por ID:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor.', 
      error: error.message 
    });
  }
};

// Crear un nuevo tipo de alojamiento
exports.createTipoAlojamiento = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ 
        message: 'El campo nombre es obligatorio.' 
      });
    }

    const nuevoTipo = await tipoAlojamiento.create({ nombre, descripcion });
    res.status(201).json({ 
      message: 'Tipo de alojamiento creado exitosamente', 
      tipo: nuevoTipo 
    });
  } catch (error) {
    console.error('Error al crear tipo de alojamiento:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'Ya existe un tipo de alojamiento con ese nombre.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor al crear el tipo de alojamiento.', 
      error: error.message 
    });
  }
};

// Actualizar un tipo de alojamiento
exports.updateTipoAlojamiento = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID debe ser un número válido.' 
      });
    }

    const { nombre, descripcion } = req.body;

    if (!nombre && !descripcion) {
      return res.status(400).json({ 
        message: 'Se requiere al menos un campo para actualizar (nombre o descripcion).' 
      });
    }

    const updated = await tipoAlojamiento.updateById(id, { nombre, descripcion });
    if (!updated) {
      return res.status(404).json({ 
        message: 'Tipo de alojamiento no encontrado.' 
      });
    }

    res.status(200).json({ 
      message: 'Tipo de alojamiento actualizado exitosamente.' 
    });
  } catch (error) {
    console.error('Error al actualizar tipo de alojamiento:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'Ya existe un tipo de alojamiento con ese nombre.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor al actualizar el tipo de alojamiento.', 
      error: error.message 
    });
  }
};

// Eliminar un tipo de alojamiento
exports.deleteTipoAlojamiento = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID debe ser un número válido.' 
      });
    }

    const deleted = await tipoAlojamiento.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ 
        message: 'Tipo de alojamiento no encontrado.' 
      });
    }

    res.status(200).json({ 
      message: 'Tipo de alojamiento eliminado exitosamente.' 
    });
  } catch (error) {
    console.error('Error al eliminar tipo de alojamiento:', error);
    
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: 'No se puede eliminar este tipo de alojamiento porque está siendo utilizado por alojamientos existentes.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor al eliminar el tipo de alojamiento.', 
      error: error.message 
    });
  }
};