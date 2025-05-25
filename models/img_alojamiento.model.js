// models/img_alojamientos.model.js

const db = require('../db');

const AlojamientoImagen = {
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM alojamiento_imagenes');
      return rows;
    } catch (err) {
      console.error('🔥 Error SQL:', err);
      throw err;
    }
  },

  getByAlojamientoId: async (id_alojamiento) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM alojamiento_imagenes WHERE id_alojamiento = ?',
        [id_alojamiento]
      );
      return rows;
    } catch (err) {
      console.error('🔥 Error en getByAlojamientoId:', err);
      throw err;
    }
  },

  // Agregar una nueva imagen
  addImage: async (data) => {
    const {
      id_alojamiento,
      url_imagen,
      es_principal = false,
      orden = null
    } = data;

    try {
      const [result] = await db.query(
        'INSERT INTO alojamiento_imagenes (id_alojamiento, url_imagen, es_principal, orden) VALUES (?, ?, ?, ?)',
        [id_alojamiento, url_imagen, es_principal, orden]
      );
      return { id_imagen: result.insertId, ...data };
    } catch (err) {
      console.error('🔥 Error en addImage:', err);
      throw err;
    }
  },

  // Eliminar una imagen por su ID
  deleteImage: async (id_imagen) => {
    try {
      const [result] = await db.query(
        'DELETE FROM alojamiento_imagenes WHERE id_imagen = ?',
        [id_imagen]
      );
      return result;
    } catch (err) {
      console.error('🔥 Error en deleteImage:', err);
      throw err;
    }
  }
};

module.exports = AlojamientoImagen;
