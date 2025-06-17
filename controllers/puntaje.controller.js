// controllers/puntaje.controller.js

const Puntaje = require('../models/puntaje.model'); // Asegúrate de la ruta correcta a tu modelo

// [GET] /api/puntajes o /api/puntajes?idAlojamiento=X&includeUnpublished=true
const getAllPuntajes = async (req, res) => {
    const idAlojamiento = req.query; // Leer parámetros de query
    // Convierte el string 'true' a booleano, cualquier otra cosa a false
    const _includeUnpublished = includeUnpublished === 'true'; 

    try {
        const puntajes = await Puntaje.getAll(idAlojamiento);
        if (puntajes.length === 0 && idAlojamiento) {
            return res.status(404).json({ message: 'No se encontraron puntajes para este alojamiento.' });
        }
        res.status(200).json(puntajes); // Usar 200 OK para GET exitosos
    } catch (err) {
        console.error('🔥 Error en puntajeController.getAllPuntajes:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener puntajes.' });
    }
};

const getPuntajesByAlojamientoId = async (req, res) => {
    const { idAlojamiento } = req.params;

    // Validación básica del ID de alojamiento
    if (!idAlojamiento || isNaN(idAlojamiento)) {
        return res.status(400).json({ message: 'ID de alojamiento no válido.' });
    }

    try {
        // Llama al mismo método getAll del modelo, pero ahora pasando el idAlojamiento
        const puntajes = await Puntaje.getByIdAloj(idAlojamiento);
        if (puntajes.length === 0) { // Aquí no importa si se encontró el alojamiento, sino si tiene puntajes
            return res.status(404).json({ message: 'No se encontraron puntajes para este alojamiento.' });
        }
        res.status(200).json(puntajes);
    } catch (err) {
        console.error('🔥 Error en puntajeController.getPuntajesByAlojamientoId:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener puntajes por ID de alojamiento.' });
    }
};

// [GET] /api/puntajes/:id
const getPuntajeById = async (req, res) => {
    try {
        const { id } = req.params;
        const puntaje = await Puntaje.getById(id);
        if (!puntaje) {
            return res.status(404).json({ message: 'Puntaje no encontrado.' });
        }
        res.status(200).json(puntaje);
    } catch (err) {
        console.error('🔥 Error en puntajeController.getPuntajeById:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener el puntaje.' });
    }
};

// [POST] /api/puntajes
// Al agregar un puntaje, el trigger 'tr_actualizar_promedio_puntaje' se ejecuta automáticamente en la DB.
const addPuntaje = async (req, res) => {
    const { id_alojamiento, puntuacion, comentario, id_usuario } = req.body;

    // Validaciones de entrada del controlador
    if (!id_alojamiento || puntuacion === undefined || id_usuario === undefined) {
        return res.status(400).json({ message: 'Los campos id_alojamiento, puntuacion e id_usuario son requeridos.' });
    }
    // Asegura que la puntuación esté en el rango antes de enviar al modelo, aunque el modelo también lo valida
    if (typeof puntuacion !== 'number' || puntuacion < 5.0 || puntuacion > 9.9) {
        return res.status(400).json({ message: 'La puntuación debe ser un número entre 5.0 y 9.9.' });
    }

    const newPuntajeData = {
        id_alojamiento,
        puntuacion,
        comentario: comentario || null, // Asegura que si es vacío o undefined, se guarde como NULL
        id_usuario: id_usuario === null || id_usuario === "" ? null : id_usuario, // Maneja 0, null, o vacío como NULL
        publicado: true // Por defecto es TRUE según tu tabla
    };

    try {
        const newPuntaje = await Puntaje.addPuntaje(newPuntajeData);
        // El trigger se encarga de actualizar 'alojamientos' en la DB
        res.status(201).json({
            message: 'Puntaje creado exitosamente. El promedio del alojamiento ha sido actualizado por el trigger.',
            puntaje: newPuntaje
        });
    } catch (err) {
        console.error('🔥 Error en puntajeController.addPuntaje:', err);
        // Manejo de errores específicos que provienen del modelo
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor al agregar puntaje.';

        if (err.message.includes('puntuación debe estar entre 5.0 y 9.9') || err.message.includes('Violación de la restricción CHECK')) {
            statusCode = 400;
            errorMessage = err.message;
        } else if (err.message.includes('ID de alojamiento o usuario no válido')) {
            statusCode = 400;
            errorMessage = err.message;
        }

        res.status(statusCode).json({ error: errorMessage });
    }
};

// [PUT] /api/puntajes/:id
const updatePuntaje = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPuntajeData = req.body; // Los campos a actualizar

        // Validación para la puntuación si se está actualizando
        if (updatedPuntajeData.puntuacion !== undefined && (typeof updatedPuntajeData.puntuacion !== 'number' || updatedPuntajeData.puntuacion < 5.0 || updatedPuntajeData.puntuacion > 9.9)) {
            return res.status(400).json({ message: 'La puntuación, si se proporciona, debe ser un número entre 5.0 y 9.9.' });
        }

        const result = await Puntaje.updatePuntaje(id, updatedPuntajeData);
        if (result === null) {
            return res.status(404).json({ message: 'Puntaje no encontrado para actualizar.' });
        }
        // Nota: La actualización del promedio en alojamientos no es automática con tu trigger actual
        res.status(200).json({ message: 'Puntaje actualizado correctamente.', puntaje: result });
    } catch (err) {
        console.error('🔥 Error en puntajeController.updatePuntaje:', err);
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor al actualizar puntaje.';

        if (err.message.includes('puntuación debe estar entre 5.0 y 9.9') || err.message.includes('Violación de la restricción CHECK')) {
            statusCode = 400;
            errorMessage = err.message;
        } else if (err.message.includes('No se proporcionaron datos para actualizar')) {
            statusCode = 400;
            errorMessage = err.message;
        }

        res.status(statusCode).json({ error: errorMessage });
    }
};

// [DELETE] /api/puntajes/:id
const deletePuntaje = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Puntaje.deletePuntaje(id);
        if (result === null) {
            return res.status(404).json({ message: 'Puntaje no encontrado para eliminar.' });
        }
        // Nota: La eliminación del promedio en alojamientos no es automática con tu trigger actual
        res.status(200).json({ message: 'Puntaje eliminado correctamente.' });
    } catch (err) {
        console.error('🔥 Error en puntajeController.deletePuntaje:', err);
        res.status(500).json({ error: 'Error interno del servidor al eliminar puntaje.' });
    }
};

module.exports = {
    getAllPuntajes,
    getPuntajesByAlojamientoId,
    getPuntajeById,
    addPuntaje,
    updatePuntaje,
    deletePuntaje,
};