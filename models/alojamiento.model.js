// backend/models/alojamiento.model.js

const db = require('../db');

const Alojamiento = {};

// Crear un nuevo alojamiento
Alojamiento.create = async (nuevoAlojamiento) => {
  const {
    nombre,
    descripcion,
    direccion,
    ciudad,
    pais,
    precio_por_noche,
    tipo_alojamiento,
    capacidad,
    disponible = true, // Valor por defecto si no se provee
    latitud,
    longitud,
    // usuario_id // Opcional: si un admin específico crea el alojamiento
  } = nuevoAlojamiento;

  try {
    const [result] = await db.query(
      `INSERT INTO alojamientos
       (nombre, descripcion, direccion, ciudad, pais, precio_por_noche, tipo_alojamiento, capacidad, disponible, latitud, longitud)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, direccion, ciudad, pais || 'Argentina', precio_por_noche, tipo_alojamiento, capacidad, disponible, latitud, longitud]
    );
    return { id: result.insertId, ...nuevoAlojamiento, disponible };
  } catch (error) {
    console.error("Error al crear alojamiento en BD:", error);
    throw error;
  }
};

// Obtener todos los alojamientos (con filtros básicos opcionales)
Alojamiento.getAll = async (filtros = {}) => {
  let query = 'SELECT * FROM alojamientos WHERE 1=1';
  const params = [];

  if (filtros.ciudad) {
    query += ' AND ciudad LIKE ?';
    params.push(`%${filtros.ciudad}%`);
  }
  if (filtros.pais) {
    query += ' AND pais LIKE ?';
    params.push(`%${filtros.pais}%`);
  }
  if (filtros.tipo_alojamiento) {
    query += ' AND tipo_alojamiento = ?';
    params.push(filtros.tipo_alojamiento);
  }
  if (filtros.disponible !== undefined) {
    query += ' AND disponible = ?';
    params.push(filtros.disponible);
  }
  if (filtros.precio_max) {
    query += ' AND precio_por_noche <= ?';
    params.push(filtros.precio_max);
  }
  if (filtros.capacidad_min) {
    query += ' AND capacidad >= ?';
    params.push(filtros.capacidad_min);
  }

  // Aquí se podrían añadir más filtros como rango de fechas de disponibilidad (más complejo, para la etapa de reservas)

  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error al obtener alojamientos de BD:", error);
    throw error;
  }
};

// Obtener un alojamiento por su ID
Alojamiento.findById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM alojamientos WHERE id = ?', [id]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null; // Retorna null si no se encuentra el alojamiento
  } catch (error) {
    console.error("Error al buscar alojamiento por ID en BD:", error);
    throw error;
  }
};

// Actualizar un alojamiento por su ID
Alojamiento.updateById = async (id, datosAlojamiento) => {
  const {
    nombre,
    descripcion,
    direccion,
    ciudad,
    pais,
    precio_por_noche,
    tipo_alojamiento,
    capacidad,
    disponible,
    latitud,
    longitud
  } = datosAlojamiento;

  // Construir la query dinámicamente para actualizar solo los campos provistos
  const fields = [];
  const values = [];

  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (direccion !== undefined) { fields.push('direccion = ?'); values.push(direccion); }
  if (ciudad !== undefined) { fields.push('ciudad = ?'); values.push(ciudad); }
  if (pais !== undefined) { fields.push('pais = ?'); values.push(pais); }
  if (precio_por_noche !== undefined) { fields.push('precio_por_noche = ?'); values.push(precio_por_noche); }
  if (tipo_alojamiento !== undefined) { fields.push('tipo_alojamiento = ?'); values.push(tipo_alojamiento); }
  if (capacidad !== undefined) { fields.push('capacidad = ?'); values.push(capacidad); }
  if (disponible !== undefined) { fields.push('disponible = ?'); values.push(disponible); }
  if (latitud !== undefined) { fields.push('latitud = ?'); values.push(latitud); }
  if (longitud !== undefined) { fields.push('longitud = ?'); values.push(longitud); }

  if (fields.length === 0) {
    throw new Error("No se proporcionaron datos para actualizar.");
  }

  values.push(id); // Añadir el ID al final para la cláusula WHERE

  try {
    const [result] = await db.query(
      `UPDATE alojamientos SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0; // Retorna true si se actualizó al menos una fila
  } catch (error) {
    console.error("Error al actualizar alojamiento en BD:", error);
    throw error;
  }
};

// Eliminar un alojamiento por su ID
Alojamiento.deleteById = async (id) => {
  try {
    // Considerar las implicaciones de ON DELETE CASCADE en la tabla `reservas`
    // Si un alojamiento se elimina, las reservas asociadas también se eliminarán.
    const [result] = await db.query('DELETE FROM alojamientos WHERE id = ?', [id]);
    return result.affectedRows > 0; // Retorna true si se eliminó al menos una fila
  } catch (error) {
    // Si hay un error de FK (por ejemplo, si no se configuró ON DELETE CASCADE y hay reservas activas)
    // se podría manejar aquí, aunque con ON DELETE CASCADE no debería ocurrir por esa causa.
    console.error("Error al eliminar alojamiento en BD:", error);
    throw error;
  }
};

module.exports = Alojamiento;