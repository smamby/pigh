// models/caracteristica.model.js
const db = require('../db');

const Caracteristica = {};

// Crear una nueva característica
Caracteristica.create = async (nuevaCaracteristica) => {
  const {
    nombre,
    icono = null,
    descripcion = null
  } = nuevaCaracteristica;

  try {
    const [result] = await db.query(
      `INSERT INTO caracteristica
       (nombre, icono, descripcion)
       VALUES (?, ?, ?)`,
      [nombre, icono, descripcion]
    );
    return { id: result.insertId, ...nuevaCaracteristica };
  } catch (error) {
    console.error("Error al crear característica en BD:", error);
    throw error;
  }
};

// Obtener todas las características (con filtros opcionales)
Caracteristica.getAll = async (filtros = {}) => {
  let query = 'SELECT * FROM caracteristica WHERE 1=1';
  const params = [];

  if (filtros.nombre) {
    query += ' AND nombre LIKE ?';
    params.push(`%${filtros.nombre}%`);
  }

  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error al obtener características de BD:", error);
    throw error;
  }
};

// Obtener una característica por su ID
Caracteristica.findById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM caracteristica WHERE id_caracteristica = ?', [id]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error al buscar característica por ID en BD:", error);
    throw error;
  }
};

// Obtener características de un alojamiento específico
Caracteristica.getCaracteristicas = async (alojamientoId) => {
    try {
      const [rows] = await db.query(
        `SELECT a.nombre_aloj AS alojamiento_nombre, c.nombre AS caracteristica_nombre 
         FROM caracteristica c
         JOIN alojamiento_caracteristica ac ON c.id_caracteristica = ac.id_caracteristica
         JOIN alojamientos a ON a.id_alojamiento = ac.id_alojamiento
         WHERE a.id_alojamiento = ?`,
        [alojamientoId]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener características con alojamientos:", error);
      throw error;
    }
  }

// Actualizar una característica por su ID
Caracteristica.updateById = async (id, datosCaracteristica) => {
  const {
    nombre,
    icono,
    descripcion
  } = datosCaracteristica;

  const fields = [];
  const values = [];

  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (icono !== undefined) { fields.push('icono = ?'); values.push(icono); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }

  if (fields.length === 0) {
    throw new Error("No se proporcionaron datos para actualizar.");
  }

  values.push(id);

  try {
    const [result] = await db.query(
      `UPDATE caracteristica SET ${fields.join(', ')} WHERE id_caracteristica = ?`,
      values
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar característica en BD:", error);
    throw error;
  }
};

// Eliminar una característica por su ID
Caracteristica.deleteById = async (id) => {
  try {
    // Primero eliminar las relaciones en alojamiento_caracteristica
    await db.query('DELETE FROM alojamiento_caracteristica WHERE id_caracteristica = ?', [id]);
    
    // Luego eliminar la característica
    const [result] = await db.query('DELETE FROM caracteristica WHERE id_caracteristica = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al eliminar característica en BD:", error);
    throw error;
  }
};


module.exports = Caracteristica;