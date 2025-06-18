const Habitacion = require('../models/habitacion.model');

// Obtener todas las habitaciones de un alojamiento con sus características y reservas
exports.getByAlojamiento = async (req, res) => {
  try {
    const { id } = req.params; // ID del alojamiento
    const habitaciones = await Habitacion.getByAlojamiento(id);
    
    if (habitaciones.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron habitaciones para este alojamiento' 
      });
    }
    
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener habitaciones',
      error: error.message 
    });
  }
};

// Obtener una habitación específica con todos sus detalles
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const habitacion = await Habitacion.getById(id);
    
    if (!habitacion) {
      return res.status(404).json({ 
        message: 'Habitación no encontrada' 
      });
    }
    
    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener la habitación',
      error: error.message 
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Validación básica de datos
    const { numero_habitacion, id_tipo_habitacion, id_alojamiento } = req.body;
    
    if (!numero_habitacion || !id_tipo_habitacion || !id_alojamiento) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: numero_habitacion, id_tipo_habitacion, id_alojamiento' 
      });
    }

    // Verificar si el número de habitación ya existe en este alojamiento
    const [existe] = await db.query(
      `SELECT 1 FROM habitaciones 
       WHERE numero_habitacion = ? AND id_alojamiento = ?`,
      [numero_habitacion, id_alojamiento]
    );

    if (existe.length > 0) {
      return res.status(409).json({ 
        message: 'Ya existe una habitación con este número en el alojamiento' 
      });
    }

    const nuevaHabitacion = await Habitacion.create(req.body);
    
    res.status(201).json({
      message: 'Habitación creada exitosamente',
      habitacion: nuevaHabitacion
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al crear la habitación',
      error: error.message 
    });
  }
};

// Actualizar una habitación existente (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la habitación existe
    const habitacionExistente = await Habitacion.getById(id);
    if (!habitacionExistente) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Validar datos de entrada
    if (req.body.plazas && req.body.plazas <= 0) {
      return res.status(400).json({ message: 'Las plazas deben ser mayor que 0' });
    }

    const actualizado = await Habitacion.update(id, req.body);
    
    if (actualizado) {
      const habitacionActualizada = await Habitacion.getById(id);
      res.json({
        message: 'Habitación actualizada exitosamente',
        habitacion: habitacionActualizada
      });
    } else {
      res.status(500).json({ message: 'No se pudo actualizar la habitación' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar la habitación',
      error: error.message 
    });
  }
};

// Eliminar una habitación (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la habitación existe
    const habitacionExistente = await Habitacion.getById(id);
    if (!habitacionExistente) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    const eliminado = await Habitacion.delete(id);
    
    if (eliminado) {
      res.json({ message: 'Habitación eliminada exitosamente' });
    } else {
      res.status(500).json({ message: 'No se pudo eliminar la habitación' });
    }
  } catch (error) {
    if (error.message.includes('No se puede eliminar una habitación con reservas activas')) {
      return res.status(400).json({ 
        message: error.message,
        suggestion: 'Cambie el estado de la habitación a "deshabilitada" en lugar de eliminarla'
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar la habitación',
      error: error.message 
    });
  }
};