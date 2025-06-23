// models/reserva.model.js

const db = require('../db');
const habitacionesCRUD = require('./habitacion.model'); // Para verificar precio y disponibilidad

const Reserva = {};

// Crear una nueva reserva
Reserva.create = async (nuevaReserva) => {
  console.log('nuevaReserva', nuevaReserva);
  const { 
    id_usuario, 
    id_alojamiento,
    id_tipo_habitacion, 
    id_habitacion,
    checkin, 
    checkout, 
    adultos, 
    menores,
    estado = 'reservada',
    cantidadBuscada
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

    const today = new Date().toISOString().split('T')[0];
    const [hayReservas] = await connection.query(
      `SELECT r.id FROM reservas r
      JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
      JOIN tipo_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
      WHERE checkin >= ?
      AND r.id_alojamiento = ?
      AND th.id_tipo_habitacion = ?`,
      [today, id_alojamiento, id_tipo_habitacion]
    )
    console.log('hay Reservas?', hayReservas)

    let precioFinalParaGuardar = 0;

    if (hayReservas.length > 0) {
      try {
        // 1. Verificar si el alojamiento está disponible para esas fechas (evitar superposiciones)
        // Esta consulta busca si existe alguna reserva para el mismo alojamiento que se solape con las fechas deseadas.
        // Dos periodos [A, B] y [C, D] se solapan si A < D y C < B.
        const [reservasSuperpuestas] = await connection.query(
          `SELECT * FROM reservas r 
          JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
           WHERE r.id_alojamiento = ?
             AND h.id_tipo_habitacion = ?
             AND r.estado IN ('pendiente', 'confirmada', 'reservada', 'activa', 'pagada')
             AND r.checkin < ?
             AND r.checkout > ?`,
          [id_alojamiento, id_tipo_habitacion, checkout, checkin]
        );
  
        const [rows] = await connection.query(
          `select count(*) AS habitaciones_existentes from habitaciones h
          WHERE id_alojamiento = ?
          AND h.id_tipo_habitacion = ?`,
          [id_alojamiento, id_tipo_habitacion]
        )
        const habitacionesExistentes = rows[0].habitaciones_existentes;

        const [habitacionesTodas] = await connection.query(
          `SELECT id_habitacion FROM habitaciones 
          WHERE id_alojamiento = ? AND id_tipo_habitacion = ?`,
          [id_alojamiento, id_tipo_habitacion]
        );

        const habitacionesOcupadas = reservasSuperpuestas.map(r => r.id_habitacion);

        // Restar las ocupadas
        const habitacionesDisponibles = habitacionesTodas
          .map(h => h.id_habitacion)
          .filter(id => !habitacionesOcupadas.includes(id));

        console.log('Habitaciones disponibles:', habitacionesDisponibles);

        /////
  
        const [reservas] = await connection.query(
          `SELECT  r.* FROM reservas r
           JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
           WHERE h.id_alojamiento = ?
            AND h.id_tipo_habitacion = ?
            AND checkin > ?`,
          [id_alojamiento, id_tipo_habitacion, today]
        );
        
        console.log((Number(reservasSuperpuestas.length) + Number(cantidadBuscada)) > Number(habitacionesExistentes))
  
        console.log('reservas', reservas)
  
        if ((Number(reservasSuperpuestas.length) + Number(cantidadBuscada)) > Number(habitacionesExistentes.length)) {
          await connection.rollback(); // Deshacer transacción
          connection.release();
          throw new Error('El alojamiento no está disponible para las fechas seleccionadas.');
        }


        // Paso 4: calcular proximidad para habitaciones con historial de reservas
        function mejoreCandidata() {
          const proximidadMap = {};
          reservas.forEach(reserva => {
            const id = reserva.id_habitacion;
            if (!proximidadMap[id]) {
              proximidadMap[id] = 0;
            }

            const diffCheckIn = Math.abs(new Date(reserva.checkin) - new Date(checkin));
            const diffCheckOut = Math.abs(new Date(reserva.checkout) - new Date(checkout));

            proximidadMap[id] += diffCheckIn + diffCheckOut;
          });

          return Object.entries(proximidadMap)
            .map(([id, distancia]) => ({ id: Number(id), proximidad: distancia }))
            .sort((a, b) => a.proximidad - b.proximidad);
        }

        // Paso 5: optimizar candidatas y complementar si falta
        let candidatas = []
        if (reservas.length !== 0) {  
          // Optimizacion en la asignacion de habitaciones para minimizar la fragmentación
          const optimizadas = mejoreCandidata();
          // Solo usar las optimizadas si están disponibles
          candidatas = optimizadas.filter(h => habitacionesDisponibles.includes(h.id));
        }

        // Si aún faltan habitaciones por asignar
        if (candidatas.length < cantidadBuscada) {
          const faltan = cantidadBuscada - candidatas.length;
          const restantes = habitacionesDisponibles.filter(id => !candidatas.some(c => c.id === id));
          candidatas.push(...restantes.slice(0, faltan).map(id => ({ id, proximidad: Infinity })));
        }
        console.log('candidatas', candidatas)
        
        // const idsVistos = new Set();
        // const candidatasSinRepetir = candidatas.filter(h => {
        //   if (idsVistos.has(h.id)) return false;
        //   idsVistos.add(h.id);
        //   return true;
        // });

        const candidatasFinal = candidatas.slice(0, cantidadBuscada).map(h => h.id);
        console.log('candidata final', candidatasFinal)
  
        const dataHabitaciones = [];
        
  
        for (c of candidatasFinal) {
          let habitacionAReservar = await habitacionesCRUD.getById(c)
          dataHabitaciones.push(habitacionAReservar);
          precioFinalParaGuardar += parseInt(habitacionAReservar['precio']);
          console.log('habitacion-A-Reservar', habitacionAReservar['id_habitacion'], habitacionAReservar['reservas'])
        }
        console.log('habitaciones para reservar:', dataHabitaciones.length);
        console.log('Precio total sin impuestos:', precioFinalParaGuardar)

        if (dataHabitaciones.length < cantidadBuscada) {
          await connection.rollback();
          connection.release();
          throw new Error('No hay suficientes habitaciones disponibles para completar la reserva.');
        }


        const grupoDeReservas = [];
        for (let i = 0; i < cantidadBuscada; i++) {                        
          
          console.log('dataHabitaciones', dataHabitaciones);
          // 3. Insertar la reserva
          let id_habitacion = dataHabitaciones[i]?.id_habitacion;

          
          const [result] = await connection.query(
            'INSERT INTO reservas (id_usuario, id_habitacion, id_alojamiento, checkin, checkout, adultos, menores, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id_usuario, id_habitacion, id_alojamiento, checkin, checkout, adultos, menores, estado]
          );

          // 🔍 Obtener el número de la habitación y precio
          const [habitacionData] = await connection.query(
            'SELECT numero_habitacion, precio FROM habitaciones WHERE id_habitacion = ?',
            [id_habitacion]
          );

          const numero_habitacion = habitacionData[0]?.numero_habitacion || null;
          const precio_habitacion = habitacionData[0]?.precio || null;
          console.log(`Reserva dentro del if ${i+1} de ${cantidadBuscada}`)    
          
          grupoDeReservas.push({ id: result.insertId, id_usuario,
                                 id_alojamiento, id_habitacion, numero_habitacion,
                                 checkin, checkout, adultos, menores,
                                 estado, precio_habitacion });
        }   
        
        await connection.commit(); // Confirmar transacción
        connection.release();

        //return grupoDeReservas;
        return {
            ok: true,
            message: 'Reserva creada exitosamente.',
            reserva: grupoDeReservas
        };

      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      };
    };

    for (let i = 0; i< cantidadBuscada; i++) {      
      try {  
        const grupoDeReservas = [];
        
        const [idHabitacionAReservar] = await connection.query(
          `SELECT id_habitacion FROM habitaciones
          WHERE id_alojamiento = ?
          AND id_tipo_habitacion = ?`,
          [id_alojamiento, id_tipo_habitacion]
        );
        console.log('idHabitacionAReservar', idHabitacionAReservar);
        // 3. Insertar la reserva
        let id_habitacion = idHabitacionAReservar[i]?.id_habitacion;

        
        const [result] = await connection.query(
            'INSERT INTO reservas (id_usuario, id_habitacion, id_alojamiento, checkin, checkout, adultos, menores, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id_usuario, id_habitacion, id_alojamiento, checkin, checkout, adultos, menores, estado]
          );

          // 🔍 Obtener el número de la habitación y precio
          const [habitacionData] = await connection.query(
            'SELECT numero_habitacion, precio FROM habitaciones WHERE id_habitacion = ?',
            [id_habitacion]
          );

          const numero_habitacion = habitacionData[0]?.numero_habitacion || null;
          const precio_habitacion = habitacionData[0]?.precio || null;  
          
          grupoDeReservas.push({ id: result.insertId, id_usuario,
                                 id_alojamiento, id_habitacion, numero_habitacion,
                                 checkin, checkout, adultos, menores,
                                 estado, precio_habitacion });
          console.log(`Reserva fuera del if ${i+1} de ${cantidadBuscada}`)

        await connection.commit(); // Confirmar transacción
        connection.release();

        //return grupoDeReservas;
        return {
            ok: true,
            message: 'Reserva creada exitosamente.',
            reserva: grupoDeReservas
        };
  
      } catch (error) {
        await connection.rollback(); // Deshacer transacción en caso de error interno
        connection.release();
        throw error; // Re-lanzar el error para que lo maneje el controlador
      }

    }
    await connection.commit(); // Confirmar transacción
    connection.release();
     
  } catch (error) {
    console.error("Error al crear reserva en BD:", error);
    throw error;
  }
};

// Obtener todas las reservas de un usuario específico por su id_usuario
Reserva.findByUserId = async (usuarioId) => {
  try {
    const [rows] = await db.query(
      // `SELECT r.*, a.nombre_aloj AS nombre_alojamiento, a.ciudad, a.pais, h.numero_habitacion, th.nombre
      // FROM reservas r
      // JOIN alojamientos a ON r.id_alojamiento = a.id_alojamiento
      // JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
      // JOIN tipo_habitacion th ON th.id_tipo_habitacion = h.id_tipo_habitacion
      // WHERE r.id_usuario = ?
      // ORDER BY r.checkin DESC`,
      `SELECT 
          r.id_usuario,
          a.nombre_aloj AS nombre_alojamiento,
          a.ciudad,
          a.pais,
          r.checkin,
          r.checkout,
          r.estado, 
          h.precio,
          COUNT(*) AS cantidad_habitaciones,
          GROUP_CONCAT(DISTINCT th.nombre SEPARATOR ', ') AS categorias_habitacion,
          GROUP_CONCAT(h.numero_habitacion SEPARATOR ', ') AS numeros_habitaciones,
          GROUP_CONCAT(r.id SEPARATOR ',') AS ids_reservas
        FROM 
          reservas r
        JOIN 
          habitaciones h ON r.id_habitacion = h.id_habitacion
        JOIN 
          tipo_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
        JOIN 
          alojamientos a ON h.id_alojamiento = a.id_alojamiento
        WHERE 
          r.id_usuario = ?
        GROUP BY 
          r.id_usuario, a.nombre_aloj, a.ciudad, a.pais, r.checkin, r.checkout, r.estado, h.precio
        ORDER BY 
          r.checkin DESC`,
      [usuarioId]
    );
    console.log('Resultado completo desde DB:', rows); // Debe mostrar todos los campos
    console.log('Primer registro:', rows[0]);
    console.log('Campos del primer registro:', Object.keys(rows[0]));
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