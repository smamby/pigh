const db = require('../db');

const TipoAlojamiento = {
  /**
   * Obtener todos los tipos de alojamiento
   * @param {Object} filtros - Objeto con posibles filtros (opcional)
   * @returns {Promise<Array>} Lista de tipos de alojamiento
   */
  async getAll(filtros = {}) {
    let query = 'SELECT * FROM tipo_alojamiento WHERE 1=1';
    const params = [];

    if (filtros.nombre) {
      query += ' AND LOWER(nombre) LIKE LOWER(?)';
      params.push(`%${filtros.nombre}%`);
    }

    try {
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error("Error al obtener tipos de alojamiento de BD:", error);
      throw error;
    }
  },

  /**
   * Obtener un tipo de alojamiento por su ID
   * @param {number} id - ID del tipo de alojamiento
   * @returns {Promise<Object|null>} Tipo de alojamiento o null si no existe
   */
  async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM tipo_alojamiento WHERE id_tipo_alojamiento = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error al buscar tipo de alojamiento por ID en BD:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo tipo de alojamiento
   * @param {Object} tipoData - Datos del tipo {nombre, descripcion?}
   * @returns {Promise<Object>} Tipo de alojamiento creado
   */
  async create(tipoData) {
    const { nombre, descripcion = null } = tipoData;

    try {
      const [result] = await db.query(
        'INSERT INTO tipo_alojamiento (nombre, descripcion) VALUES (?, ?)',
        [nombre, descripcion]
      );
      return { id_tipo_alojamiento: result.insertId, nombre, descripcion };
    } catch (error) {
      console.error("Error al crear tipo de alojamiento en BD:", error);
      throw error;
    }
  },

  /**
   * Actualizar un tipo de alojamiento
   * @param {number} id - ID del tipo a actualizar
   * @param {Object} updateData - Datos a actualizar {nombre?, descripcion?}
   * @returns {Promise<boolean>} True si se actualizó correctamente
   */
  async updateById(id, updateData) {
    const { nombre, descripcion } = updateData;
    const fields = [];
    const values = [];

    if (nombre !== undefined) { 
      fields.push('nombre = ?'); 
      values.push(nombre); 
    }
    if (descripcion !== undefined) { 
      fields.push('descripcion = ?'); 
      values.push(descripcion); 
    }

    if (fields.length === 0) {
      throw new Error("No se proporcionaron datos para actualizar.");
    }

    values.push(id);

    try {
      const [result] = await db.query(
        `UPDATE tipo_alojamiento SET ${fields.join(', ')} WHERE id_tipo_alojamiento = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar tipo de alojamiento en BD:", error);
      throw error;
    }
  },

  /**
   * Eliminar un tipo de alojamiento
   * @param {number} id - ID del tipo a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteById(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM tipo_alojamiento WHERE id_tipo_alojamiento = ?', 
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar tipo de alojamiento en BD:", error);
      throw error;
    }
  }
};

module.exports = TipoAlojamiento;