const db = require('../db');

const Habitacion = {
  // Obtener todas las habitaciones de un alojamiento con sus características y reservas
  getByAlojamiento: async (idAlojamiento) => {
    try {
      // Obtener habitaciones básicas
      const [habitaciones] = await db.query(`
        SELECT h.*, th.nombre AS tipo_habitacion_nombre, 
               th.descripcion AS tipo_habitacion_descripcion,
               th.plazas,
               th.tamanio_m2, th.camas_detalle, th.precio_base
        FROM habitaciones h
        JOIN tipo_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
        WHERE h.id_alojamiento = ? AND h.estado = 'habilitada'
      `, [idAlojamiento]);

      if (!habitaciones.length) {
        return [];
      }

      // Obtener características para cada tipo de habitación
      const habitacionesConCaracteristicas = await Promise.all(
        habitaciones.map(async (habitacion) => {
          const [caracteristicas] = await db.query(`
            SELECT ch.id_caracteristica, ch.nombre, ch.icono, ch.descripcion
            FROM caracteristicas_habitacion ch
            JOIN habitacion_tipo_caracteristica htc ON ch.id_caracteristica = htc.id_caracteristica
            WHERE htc.id_tipo_habitacion = ?
          `, [habitacion.id_tipo_habitacion]);

          // Obtener reservas para esta habitación
          const [reservas] = await db.query(`
            SELECT id, id_usuario, checkin, checkout, estado
            FROM reservas
            WHERE id_habitacion = ? AND estado IN ('activa', 'reservada', 'pagada', 'pendiente')
          `, [habitacion.id_habitacion]);

          return {
            ...habitacion,
            caracteristicas,
            reservas
          };
        })
      );

      return habitacionesConCaracteristicas;
    } catch (error) {
      console.error("Error al obtener habitaciones:", error);
      throw error;
    }
  },

  // Obtener una habitación específica con todos sus detalles
  getById: async (idHabitacion) => {
    try {
      // Obtener información básica de la habitación
      const [habitaciones] = await db.query(`
        SELECT h.*, th.nombre AS tipo_habitacion_nombre, 
               th.descripcion AS tipo_habitacion_descripcion,
               th.plazas,
               th.tamanio_m2, th.camas_detalle, th.precio_base
        FROM habitaciones h
        JOIN tipo_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
        WHERE h.id_habitacion = ?
      `, [idHabitacion]);

      if (!habitaciones.length) {
        return null;
      }

      const habitacion = habitaciones[0];

      // Obtener características
      const [caracteristicas] = await db.query(`
        SELECT ch.id_caracteristica, ch.nombre, ch.icono, ch.descripcion
        FROM caracteristicas_habitacion ch
        JOIN habitacion_tipo_caracteristica htc ON ch.id_caracteristica = htc.id_caracteristica
        WHERE htc.id_tipo_habitacion = ?
      `, [habitacion.id_tipo_habitacion]);

      // Obtener reservas
      const [reservas] = await db.query(`
        SELECT id, id_usuario, checkin, checkout, estado
        FROM reservas
        WHERE id_habitacion = ?
        ORDER BY checkin
      `, [idHabitacion]);

      return {
        ...habitacion,
        caracteristicas,
        reservas
      };
    } catch (error) {
      console.error("Error al obtener habitación por ID:", error);
      throw error;
    }
  },

  // Crear una nueva habitación
  create: async (habitacionData) => {
    try {
      const { 
        numero_habitacion, 
        id_tipo_habitacion,
        precio,
        id_alojamiento,
        notas = null
      } = habitacionData;

      const [result] = await db.query(
        `INSERT INTO habitaciones 
        (numero_habitacion, id_tipo_habitacion, precio, id_alojamiento, notas)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [numero_habitacion, id_tipo_habitacion, plazas, precio, id_alojamiento, notas]
      );

      return { id: result.insertId, ...habitacionData };
    } catch (error) {
      console.error("Error al crear habitación:", error);
      throw error;
    }
  },

  // Actualizar una habitación existente
  update: async (idHabitacion, habitacionData) => {
    try {
      const { 
        numero_habitacion, 
        id_tipo_habitacion,
        precio,
        estado,
        id_alojamiento,
        notas
      } = habitacionData;

      const [result] = await db.query(
        `UPDATE habitaciones SET
          numero_habitacion = ?,
          id_tipo_habitacion = ?,
          precio = ?,
          estado = ?,
          id_alojamiento = ?,
          notas = ?
        WHERE id_habitacion = ?`,
        [numero_habitacion, id_tipo_habitacion, plazas, precio, estado, id_alojamiento, notas, idHabitacion]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
      throw error;
    }
  },

  // Eliminar una habitación
  delete: async (idHabitacion) => {
    try {
      // Primero verificamos si tiene reservas activas
      const [reservas] = await db.query(
        `SELECT COUNT(*) as count FROM reservas 
         WHERE id_habitacion = ? AND estado IN ('activa', 'reservada', 'pagada')`,
        [idHabitacion]
      );

      if (reservas[0].count > 0) {
        throw new Error('No se puede eliminar una habitación con reservas activas');
      }

      // Si no tiene reservas, procedemos a eliminar
      const [result] = await db.query(
        `DELETE FROM habitaciones WHERE id_habitacion = ?`,
        [idHabitacion]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar habitación:", error);
      throw error;
    }
  }
};


module.exports = Habitacion;