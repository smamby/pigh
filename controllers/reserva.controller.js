// controllers/reserva.controller.js

const Reserva = require('../models/reserva.model');
const Alojamiento = require('../models/alojamiento.model'); // Para obtener datos del alojamiento

// Crear una nueva reserva
exports.createReserva = async (req, res) => {
  try {
    const usuario_id = req.usuario_id; // Obtenido del token JWT (middleware authenticateToken)
    //const { alojamiento_id, fecha_inicio, fecha_fin } = req.body;

    // Validaciones básicas
    // if (!alojamiento_id || !fecha_inicio || !fecha_fin) {
    //   return res.status(400).json({ message: 'El ID del alojamiento, fecha de inicio y fecha de fin son obligatorios.' });
    // }

    // Convertir fechas a formato YYYY-MM-DD por si vienen en otro formato,
    // aunque el input type="date" del HTML suele enviar este formato.
    // Es buena práctica asegurarse o validar el formato esperado por MySQL.
    // const formattedFechaInicio = new Date(fecha_inicio).toISOString().slice(0, 10);
    // const formattedFechaFin = new Date(fecha_fin).toISOString().slice(0, 10);


    // const nuevaReservaData = {
    //   usuario_id,
    //   alojamiento_id: parseInt(alojamiento_id),
    //   fecha_inicio: formattedFechaInicio,
    //   fecha_fin: formattedFechaFin,
      // precio_total se calculará en el modelo
      // estado por defecto es 'Pendiente' en el modelo
      //};
      
      //const reserva = await Reserva.create(nuevaReservaData);
      console.log('controller-req.body', req.body);
      const reserva = await Reserva.create(req.body);
      res.status(201).json({ message: 'Reserva creada exitosamente.', reserva });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    // Errores específicos del modelo
    if (error.message.includes('La fecha de inicio debe ser anterior') ||
        error.message.includes('La fecha de inicio no puede ser en el pasado') ||
        error.message.includes('El alojamiento no está disponible') ||
        error.message.includes('Alojamiento no encontrado') ||
        error.message.includes('El alojamiento no se encuentra disponible actualmente') ||
        error.message.includes('La duración de la estadía debe ser de al menos una noche') ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear la reserva.', error: error.message });
  }
};

// Listar las reservas del usuario autenticado
exports.getMisReservas = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const reservas = await Reserva.findByUserId(id_usuario);
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener mis reservas:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};
// 
exports.getReservasAlojamiento = async (req, res) => {
  try {
    const id_alojamiento = req.alojamiento.id;
    const reservas = await Reserva.findByAlojamientoId(id_alojamiento);
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener mis reservas:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

// (Opcional) Obtener detalle de una reserva específica del usuario autenticado
exports.getMiReservaById = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params; // ID de la reserva
        const reserva = await Reserva.findById(id, usuario_id); // Pasar usuario_id para seguridad

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada o no pertenece al usuario.' });
        }
        res.status(200).json(reserva);
    } catch (error) {
        console.error('Error al obtener mi reserva por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// (Opcional) Cancelar una reserva del usuario autenticado
exports.cancelarMiReserva = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params; // ID de la reserva a cancelar

        // El modelo Reserva.updateStatus ya incluye la lógica para verificar pertenencia si se pasa usuario_id
        // y otras reglas de negocio (ej. no cancelar si ya pasó la fecha).
        const actualizada = await Reserva.updateStatus(id, 'Cancelada', usuario_id);

        if (!actualizada) {
            // Esto podría ser porque la reserva no existe, no pertenece al usuario, o no se pudo actualizar por reglas de negocio.
            // El modelo debería haber lanzado un error más específico que podríamos capturar aquí.
            return res.status(404).json({ message: 'No se pudo cancelar la reserva. Verifica que exista, te pertenezca y cumpla las condiciones para cancelación.' });
        }
        res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
    } catch (error)
    {
        console.error('Error al cancelar mi reserva:', error);
        if (error.message.includes('Reserva no encontrada') || error.message.includes('No se puede cancelar una reserva')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al cancelar la reserva.', error: error.message });
    }
};


// --- Funciones para Administradores (requieren isAdmin middleware) ---

// (Opcional Admin) Listar todas las reservas
exports.getAllReservasAdmin = async (req, res) => {
    try {
        // Aquí se pueden pasar filtros desde req.query si se desea
        const filtros = req.query; // ej. /api/reservas/admin/all?alojamiento_id=1&estado=Confirmada
        const reservas = await Reserva.getAll(filtros);
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Error al obtener todas las reservas (admin):', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// (Opcional Admin) Obtener detalle de cualquier reserva por ID
exports.getReservaByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id); // No se pasa usuario_id para que el admin pueda ver cualquiera
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }
        res.status(200).json(reserva);
    } catch (error) {
        console.error('Error al obtener reserva por ID (admin):', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};

// (Opcional Admin) Actualizar estado de cualquier reserva (ej. Confirmar, Completar)
exports.updateReservaStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ message: 'El nuevo estado es obligatorio.' });
        }
        // Aquí se podrían añadir más validaciones sobre los estados permitidos

        const actualizada = await Reserva.updateStatus(id, estado); // No se pasa usuario_id
        if (!actualizada) {
            return res.status(404).json({ message: 'Reserva no encontrada o no se pudo actualizar el estado.' });
        }
        res.status(200).json({ message: `Estado de la reserva actualizado a ${estado}.`});
    } catch (error) {
        console.error('Error al actualizar estado de reserva (admin):', error);
         if (error.message.includes('Reserva no encontrada') || error.message.includes('No se puede cancelar una reserva')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};