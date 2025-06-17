// models/puntaje.model.js

const db = require('../db'); // Esto importará tu 'pool.promise()'

const Puntaje = {
    // Método para obtener todos los puntajes, ahora también usado para filtrar por alojamiento
    // Si idAlojamiento es null, devuelve todos los publicados.
    // Si idAlojamiento tiene un valor, devuelve los publicados para ese alojamiento.
    getAll: async () => {
        let query = 'SELECT * FROM puntaje';
        const params = [];

        try {
            const [rows] = await db.query(query, params);
            return rows;
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.getAll:', err);
            throw err;
        }
    },

    // Obtener un puntaje por su ID
    getByIdAloj: async (id_alojamiento) => {
        try {
            const [rows] = await db.query(
                'SELECT puntaje.*, usuarios.nombre, usuarios.apellido FROM puntaje' + 
                ' JOIN usuarios ON puntaje.id_usuario = usuarios.id_usuario' +
                ' JOIN alojamientos ON puntaje.id_alojamiento = alojamientos.id_alojamiento' +
                ' WHERE puntaje.id_alojamiento = ?',
                [id_alojamiento]
            );
            return rows; // Retorna el primer resultado o undefined si no se encuentra
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.getById:', err);
            throw err;
        }
    },

    // Obtener un puntaje por su ID
    getById: async (id_puntaje) => {
        try {
            const [rows] = await db.query(
                'SELECT puntaje.*, usuarios.nombre, usuarios.apellido FROM puntaje' + 
                ' JOIN usuarios ON puntaje.id_usuario = usuarios.id_usuario' +
                ' JOIN alojamientos ON puntaje.id_alojamiento = alojamientos.id_alojamiento' +
                ' WHERE puntaje.id_puntaje = ?',
                [id_puntaje]
            );
            return rows[0]; // Retorna el primer resultado o undefined si no se encuentra
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.getById:', err);
            throw err;
        }
    },

    // Crear un nuevo puntaje
    // El trigger 'tr_actualizar_promedio_puntaje' en la base de datos
    // se ejecutará automáticamente DESPUÉS de esta inserción.
    addPuntaje: async (data) => {
        const {
            id_alojamiento,
            puntuacion,
            comentario = null, // Valor por defecto para permitir NULL si no se envía
            id_usuario = null, // Valor por defecto para permitir NULL si no se envía (según FK)
            publicado = true   // Valor por defecto según tu tabla
        } = data;

        // Validaciones básicas de modelo si no están en el controlador
        if (puntuacion < 5.0 || puntuacion > 9.9) {
            throw new Error('La puntuación debe estar entre 5.0 y 9.9.');
        }

        try {
            const [result] = await db.query(
                'INSERT INTO puntaje (id_alojamiento, puntuacion, comentario, id_usuario, publicado) VALUES (?, ?, ?, ?, ?)',
                [id_alojamiento, puntuacion, comentario, id_usuario, publicado]
            );
            return { id_puntaje: result.insertId, ...data };
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.addPuntaje:', err);
            // Manejo de errores específicos para FK o CHECK constraint
            if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
                throw new Error('ID de alojamiento o usuario no válido.');
            }
            if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                throw new Error('Violación de la restricción CHECK: La puntuación no cumple el rango permitido.');
            }
            throw err; // Re-lanza el error general si no es un error específico
        }
    },

    // Actualizar un puntaje existente
    updatePuntaje: async (id_puntaje, data) => {
        const {
            puntuacion,
            comentario,
            publicado
        } = data;

        let query = 'UPDATE puntaje SET ';
        const updates = [];
        const params = [];

        // Construir la consulta dinámicamente según los campos presentes en 'data'
        if (puntuacion !== undefined) {
            if (puntuacion < 5.0 || puntuacion > 9.9) {
                throw new Error('La puntuación debe estar entre 5.0 y 9.9.');
            }
            updates.push('puntuacion = ?');
            params.push(puntuacion);
        }
        if (comentario !== undefined) {
            updates.push('comentario = ?');
            params.push(comentario);
        }
        if (publicado !== undefined) {
            updates.push('publicado = ?');
            params.push(publicado);
        }

        if (updates.length === 0) {
            throw new Error('No se proporcionaron datos para actualizar.');
        }

        query += updates.join(', ') + ' WHERE id_puntaje = ?';
        params.push(id_puntaje); // El ID del puntaje siempre es el último parámetro

        try {
            const [result] = await db.query(query, params);
            if (result.affectedRows === 0) {
                return null; // Indica que el puntaje no fue encontrado
            }
            // NOTA: Las actualizaciones de puntuacion NO activan tu trigger AFTER INSERT.
            // Si necesitas recalcular el promedio al actualizar, necesitarías un trigger AFTER UPDATE
            // o lógica de recálculo manual en el controlador/servicio.
            return { id_puntaje, ...data };
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.updatePuntaje:', err);
            if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                throw new Error('Violación de la restricción CHECK: La puntuación no cumple el rango permitido.');
            }
            throw err;
        }
    },

    // Eliminar un puntaje
    deletePuntaje: async (id_puntaje) => {
        try {
            const [result] = await db.query(
                'DELETE FROM puntaje WHERE id_puntaje = ?',
                [id_puntaje]
            );
            if (result.affectedRows === 0) {
                return null; // Indica que el puntaje no fue encontrado
            }
            // NOTA: La eliminación de puntaje NO activará tu trigger AFTER INSERT.
            // Si necesitas recalcular el promedio al eliminar, necesitarías un trigger AFTER DELETE
            // o lógica de recálculo manual en el controlador/servicio.
            return { message: 'Puntaje eliminado correctamente.', affectedRows: result.affectedRows };
        } catch (err) {
            console.error('🔥 Error SQL en Puntaje.deletePuntaje:', err);
            throw err;
        }
    }
};

module.exports = Puntaje;