// models/reserva.model.js

const db = require('../db');
const habiotacionesCRUD = require('./habitacion.model'); // Para verificar precio y disponibilidad

const Reserva = {};

// Crear una nueva reserva
Reserva.create = async (nuevaReserva, cantidadDisponible, cantidadBuscada) => {
  const { 
    id_usuario, 
    id_alojamiento,
    id_tipo_habitacion, 
    id_habitacion,
    checkin, 
    checkout, 
    adultos, 
    menores,
    estado = 'reservada'
  } = nuevaReserva;

  // Validar que las fechas sean lógicas (aunque ya tengamos un CHECK en la BD, es bueno validar aquí)
  if (new Date(checkin) >= new Date(checkout)) {
    throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
  }
  // Validar que las fechas no sean en el pasado
  if (new Date(checkin) < new Date().setHours(0,0,0,0)) { // Comparar con el inicio del día actual
    throw new Error('La fecha de inicio no puede ser en el pasado.');
  }

  try {
    // Iniciar una transacción para asegurar la atomicidad (verificar disponibilidad y crear reserva)
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Verificar si el alojamiento está disponible para esas fechas (evitar superposiciones)
      // Esta consulta busca si existe alguna reserva para el mismo alojamiento que se solape con las fechas deseadas.
      // Dos periodos [A, B] y [C, D] se solapan si A < D y C < B.
      const [reservasSuperpuestas] = await connection.query(
        `SELECT * FROM reservas
         WHERE id_alojamiento = ?
           AND id_tipo_habitacion = ?
           AND estado IN ('pendiente', 'confirmada', 'reservada', 'activa', 'pagada') -- Solo considerar reservas activas
           AND checkin < ?
           AND checkout > ?`,
        [id_alojamiento, id_tipo_habitacion, checkout, checkin]
      );

      const [habitacionesExistentes] = await connection.query(
        `SELECT h.id_habitacion, h.reservas FROM habitaciones h
         JOIN reservas r ON r.id_habitacion = h.id_habitacion
         WHERE id_alojamiento = ?
          AND id_tipo_habitacion = ?`,
        [id_alojamiento, id_tipo_habitacion]
      );

      if (reservasSuperpuestas.length + cantidadBuscada > habitacionesExistentes.length) {
        await connection.rollback(); // Deshacer transacción
        connection.release();
        throw new Error('El alojamiento no está disponible para las fechas seleccionadas.');
      }

      // Optimizacion en la asignacion de habitaciones para minimizar la fragmentación
      function mejoreCandidata () {

        function diferenciaDias(date1, date2) {
          const ms = Math.abs(new Date(date1) - new Date(date2));
          return ms / (1000 * 60 * 60 * 24);
        }
  
        const candidatas = [];
  
        for (const hab of habitacionesExistentes) {
          if (!hayConflicto(hab.reservas, nuevaReserva)) {
            // Encuentra la reserva más cercana en días
            const diferencias = hab.reservas.map(r =>
              Math.min(
                diferenciaDias(r.checkin, nuevaReserva.checkout),
                diferenciaDias(r.checkout, nuevaReserva.checkin)
              )
            );
  
            const minProximidad = diferencias.length > 0 ? Math.min(...diferencias) : Infinity;
  
            candidatas.push({
              id: hab.id,
              reservas: hab.reservas,
              proximidad: minProximidad
            });
          }
        }
        if (candidatas.length === 0) return null;
        candidatas.sort((a, b) => a.proximidad - b.proximidad);
        const candidataId = candidatas[0].id;
        return candidataId;
      }
      const candidatasFinal = []; // se recojera los id's de las habitaciones seleccionadas para la reserva
      for (let i = 1; i<= cantidadBuscada; i++) {
        candidatasFinal.push(mejoreCandidata());
      }

      // 2. Obtener el precio por noche del alojamiento para calcular el precio total (si no se proveyó)
      //    o para verificar el precio_total enviado.
      //    En un MVP, podríamos confiar en el precio_total calculado en el frontend
      //    pero es más seguro recalcularlo o verificarlo en el backend.
      // const alojamiento = await Alojamiento.findById(alojamiento_id); // Usando el modelo Alojamiento existente
      // if (!alojamiento) {
      //   await connection.rollback();
      //   connection.release();
      //   throw new Error('Alojamiento no encontrado.');
      // }
      // if (!alojamiento.disponible) { // Verificación adicional por si acaso
      //   await connection.rollback();
      //   connection.release();
      //   throw new Error('El alojamiento no se encuentra disponible actualmente.');
      // }

      // const noches = Math.ceil((new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24));
      // if (noches <= 0) { // Debería ser cubierto por la validación de fechas, pero doble check.
      //     await connection.rollback();
      //     connection.release();
      //     throw new Error('La duración de la estadía debe ser de al menos una noche.');
      // }
      // const precioCalculado = noches * alojamiento.precio_por_noche;

      // Comparar si el precio_total enviado es correcto (opcional, pero recomendado)
      // if (precio_total !== precioCalculado) {
      //   console.warn(`Advertencia: El precio_total enviado (${precio_total}) difiere del calculado (${precioCalculado}). Se usará el calculado.`);
      // }
      // Para el MVP, vamos a usar el precio calculado en el backend
      const dataHabitaciones = [];
      const precioFinalParaGuardar = 0;
      for (candidata of candidatasFinal) {
        let habitacionAReservar = habiotacionesCRUD.getById(candidata)
        dataHabitaciones.push(habitacionAReservar);
        precioFinalParaGuardar += habitacionAReservar.precio;
      }
      console.log('habitaciones para reservar:', dataHabitaciones);
      console.log('Precio total sin impuestos:', precioFinalParaGuardar);
      return

      // 3. Insertar la reserva
      const [result] = await connection.query(
        'INSERT INTO reservas (usuario_id, alojamiento_id, fecha_inicio, fecha_fin, tipo_habitación, numero_habitacion, precio_total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [usuario_id, alojamiento_id, fecha_inicio, fecha_fin, tipo_habitación, numero_habitacion, precioFinalParaGuardar, estado]
      );

      await connection.commit(); // Confirmar transacción
      connection.release();

      return { id: result.insertId, usuario_id, alojamiento_id, fecha_inicio, fecha_fin, precio_total: precioFinalParaGuardar, estado };

    } catch (error) {
      await connection.rollback(); // Deshacer transacción en caso de error interno
      connection.release();
      throw error; // Re-lanzar el error para que lo maneje el controlador
    }
  } catch (error) {
    console.error("Error al crear reserva en BD:", error);
    throw error;
  }
};

// Obtener todas las reservas de un usuario específico por su id_usuario
Reserva.findByUserId = async (usuarioId) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, a.nombre_aloj AS nombre_alojamiento, a.ciudad, a.pais, h.numero_habitacion, th.nombre
      FROM reservas r
      JOIN alojamientos a ON r.id_alojamiento = a.id_alojamiento
      JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
      JOIN tipo_habitacion th ON th.id_tipo_habitacion = h.id_tipo_habitacion
      WHERE r.id_usuario = ?
      ORDER BY r.checkin DESC`,
      [usuarioId]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener reservas por usuario_id en BD:", error);
    throw error;
  }
};

// Obtener todas las reservas de un alojamiento específico por su id_alojamiento
Reserva.findByAlojamientoId = async (id_alojamiento) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, a.nombre_aloj AS nombre_alojamiento, a.ciudad, a.pais, h.numero_habitacion, th.nombre, u.nombre, u.apellido, u.email
      FROM reservas r
      JOIN alojamientos a ON r.id_alojamiento = a.id_alojamiento
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
      JOIN tipo_habitacion th ON th.id_tipo_habitacion = h.id_tipo_habitacion
      WHERE a.id_alojamiento = ?
      ORDER BY r.checkin DESC`,
      [id_alojamiento]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener reservas por alojamiento_id en BD:", error);
    throw error;
  }
};

// Obtener una reserva específica por su ID (y opcionalmente por usuario_id para seguridad)
Reserva.findById = async (id, usuarioId = null) => {
  try {
    let query = `SELECT r.*, a.nombre AS nombre_alojamiento, a.ciudad, a.pais,
                        u.nombre AS nombre_usuario, u.apellido AS apellido_usuario, u.email AS email_usuario
                 FROM reservas r
                 JOIN alojamientos a ON r.alojamiento_id = a.id
                 JOIN usuarios u ON r.usuario_id = u.id
                 WHERE r.id = ?`;
    const params = [id];

    if (usuarioId) {
      query += ' AND r.usuario_id = ?';
      params.push(usuarioId);
    }

    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error al buscar reserva por ID en BD:", error);
    throw error;
  }
};

// (Opcional MVP) Actualizar estado de una reserva (ej. para cancelación)
Reserva.updateStatus = async (id, estado, usuarioId = null) => {
  try {
    // Solo permitir al usuario dueño de la reserva o a un admin (sin usuarioId) cancelar.
    // Para este ejemplo, si se pasa usuarioId, se verifica que sea el dueño.
    const reservaActual = await Reserva.findById(id, usuarioId);
    if (!reservaActual) {
        throw new Error('Reserva no encontrada o no pertenece al usuario.');
    }

    // Lógica de negocio para cancelación (ej: no cancelar si ya pasó la fecha de inicio)
    if (estado === 'Cancelada' && new Date(reservaActual.fecha_inicio) <= new Date()) {
        if (reservaActual.estado !== 'Pendiente' && reservaActual.estado !== 'Confirmada') { // No se puede cancelar algo ya cancelado o completado
             throw new Error(`No se puede cancelar una reserva con estado '${reservaActual.estado}'.`);
        }
        // Se podría añadir lógica de plazos de cancelación aquí.
    }


    const [result] = await db.query(
      'UPDATE reservas SET estado = ? WHERE id = ?' + (usuarioId ? ' AND usuario_id = ?' : ''),
      usuarioId ? [estado, id, usuarioId] : [estado, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar estado de reserva en BD:", error);
    throw error;
  }
};

// (Opcional MVP Admin) Obtener todas las reservas (para admin)
Reserva.getAll = async (filtros = {}) => {
    let query = `SELECT r.*, a.nombre AS nombre_alojamiento, u.email AS email_usuario
                 FROM reservas r
                 JOIN alojamientos a ON r.alojamiento_id = a.id
                 JOIN usuarios u ON r.usuario_id = u.id
                 WHERE 1=1`;
    const params = [];

    if (filtros.alojamiento_id) {
        query += ' AND r.alojamiento_id = ?';
        params.push(filtros.alojamiento_id);
    }
    if (filtros.estado) {
        query += ' AND r.estado = ?';
        params.push(filtros.estado);
    }
    // Añadir más filtros si es necesario (por fecha, usuario, etc.)
    query += ' ORDER BY r.fecha_reserva DESC';

    try {
        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        console.error("Error al obtener todas las reservas (admin) en BD:", error);
        throw error;
    }
};


module.exports = Reserva;