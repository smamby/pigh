// controllers/alojamiento.controller.js

const Alojamiento = require('../models/alojamiento.model');

// Crear un nuevo alojamiento (solo admin)
exports.createAlojamiento = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      direccion,
      ciudad,
      pais,
      precio_por_noche,
      tipo_alojamiento,
      capacidad,
      disponible, // Opcional, por defecto true en el modelo
      latitud,    // Opcional
      longitud    // Opcional
    } = req.body;

    // Validaciones básicas
    if (!nombre || !precio_por_noche || !tipo_alojamiento || !capacidad || !ciudad) {
      return res.status(400).json({ message: 'Los campos nombre, precio_por_noche, tipo_alojamiento, capacidad y ciudad son obligatorios.' });
    }
    if (isNaN(parseFloat(precio_por_noche)) || parseFloat(precio_por_noche) <= 0) {
        return res.status(400).json({ message: 'El precio por noche debe ser un número positivo.' });
    }
    if (isNaN(parseInt(capacidad)) || parseInt(capacidad) <= 0) {
        return res.status(400).json({ message: 'La capacidad debe ser un número entero positivo.' });
    }

    const nuevoAlojamiento = await Alojamiento.create({
      nombre,
      descripcion,
      direccion,
      ciudad,
      pais, // El modelo lo pone por defecto a 'Argentina' si es undefined
      precio_por_noche: parseFloat(precio_por_noche),
      tipo_alojamiento,
      capacidad: parseInt(capacidad),
      disponible,
      latitud: latitud ? parseFloat(latitud) : null,
      longitud: longitud ? parseFloat(longitud) : null,
      // usuario_id: req.user.id // Opcional: si quieres registrar quién lo creó
    });
    res.status(201).json({ message: 'Alojamiento creado exitosamente', alojamiento: nuevoAlojamiento });
  } catch (error) {
    console.error('Error al crear alojamiento:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear el alojamiento.', error: error.message });
  }
};

// Obtener todos los alojamientos (público o admin, según se defina en rutas)
// Los filtros se pueden pasar como query params: /api/alojamientos?ciudad=Mendoza&disponible=true
exports.getAllAlojamientos = async (req, res) => {
  try {
    // req.query contendrá los parámetros de la URL, ej: { ciudad: 'Cordoba', disponible: 'true' }
    const filtros = { ...req.query };
    if (filtros.disponible !== undefined) {
        filtros.disponible = filtros.disponible === 'true'; // Convertir string a boolean
    }
    if (filtros.precio_max) {
        filtros.precio_max = parseFloat(filtros.precio_max);
    }
    if (filtros.capacidad_min) {
        filtros.capacidad_min = parseInt(filtros.capacidad_min);
    }

    const alojamientos = await Alojamiento.getAll(filtros);
    res.status(200).json(alojamientos);
  } catch (error) {
    console.error('Error al obtener alojamientos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener los alojamientos.', error: error.message });
  }
};

// Obtener un alojamiento por su ID (público o admin)
//exports.getAlojamientoById = async (req, res) => {
 // try {
   // const id = req.params.id;

    // Busca el alojamiento principal
    //const alojamiento = await Alojamiento.findByPk(id);

    //if (!alojamiento) {
     // return res.status(404).json({ message: 'Alojamiento no encontrado' });
    //}

    // Busca el tipo de alojamiento
    // const tipo = await TipoAlojamiento.findByPk(alojamiento.id_tipo_alojamiento);

    // Busca las imágenes del alojamiento
    // const imagenes = await ImgAlojamiento.findAll({ where: { id_alojamiento: id } });

    // Si tienes servicios relacionados, descomenta y ajusta:
    // const servicios = await Servicio.findAll({ where: { id_alojamiento: id } });

   // res.json({
     // id: alojamiento.id_alojamiento,
      //nombre: alojamiento.nombre,
      //descripcion: alojamiento.descripcion,
      //direccion: alojamiento.direccion,
      //ciudad: alojamiento.ciudad,
      //pais: alojamiento.pais,
      //tipo_alojamiento: tipo ? tipo.nombre : '',
      //capacidad: alojamiento.capacidad,
      //precio_por_noche: alojamiento.precio,
      //disponible: alojamiento.disponible,
      //foto_principal: imagenes[0] ? imagenes[0].url_imagen : '',
      //fotos: imagenes.map(img => img.url_imagen),
      // servicios: servicios.map(s => s.nombre), // Descomenta si tienes servicios
      // ...otros campos que quieras agregar...
    // });
  //} catch (error) {
    //console.error('Error al obtener alojamiento por ID:', error);
    //res.status(500).json({ message: 'Error interno del servidor' });
 // }
//}; //

const db = require('../db');
const AlojamientoImagen = require('../models/img_alojamiento.model.js');

exports.getAlojamientoById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM alojamientos WHERE id_alojamiento = ?', [id]);
    const alojamiento = rows[0];

    if (!alojamiento) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    // Traer imágenes usando tu modelo
     const imagenes = await AlojamientoImagen.getByAlojamientoId(id);

    res.json({
      id: alojamiento.id_alojamiento,
      nombre: alojamiento.nombre_aloj,
      descripcion: alojamiento.descripcion,
      direccion: alojamiento.direccion,
      ciudad: alojamiento.ciudad,
      pais: alojamiento.pais,
      tipo_alojamiento: alojamiento.id_tipo_alojamiento, // o puedes mapear a texto si tienes tabla de tipos
      capacidad: alojamiento.capacidad,
      precio_por_noche: alojamiento.precio,
      disponible: alojamiento.activo,
      latitud: alojamiento.latitud,
      longitud: alojamiento.longitud,
      estrellas: alojamiento.estrellas,
      telefono: alojamiento.telefono,
      email: alojamiento.email,
      politicas: alojamiento.politicas,
      check_in_hora: alojamiento.check_in_hora,
      check_out_hora: alojamiento.check_out_hora,
      promedio_puntaje: alojamiento.promedio_puntaje,
      cantidad_puntajes: alojamiento.cantidad_puntajes,
      foto_principal: imagenes[0]?.url_imagen || '',
      fotos: imagenes.map(img => img.url_imagen),
    });
  } catch (error) {
    console.error('Error al obtener alojamiento por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener lista de destinos (ciudades) disponibles
exports.destinos = async (req, res) => {
  const params = req.query.ciudad || '';
  try {
    const destinos = await Alojamiento.getDestinos(params);
    
    res.status(200).json(destinos);
  } catch (error) {
    console.error('Error al obtener datos', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

// Actualizar un alojamiento (solo admin)
exports.updateAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const datosAlojamiento = req.body;

    // Validaciones opcionales para los datos de entrada
    if (datosAlojamiento.precio_por_noche !== undefined && (isNaN(parseFloat(datosAlojamiento.precio_por_noche)) || parseFloat(datosAlojamiento.precio_por_noche) <= 0)) {
        return res.status(400).json({ message: 'El precio por noche debe ser un número positivo.' });
    }
    if (datosAlojamiento.capacidad !== undefined && (isNaN(parseInt(datosAlojamiento.capacidad)) || parseInt(datosAlojamiento.capacidad) <= 0)) {
        return res.status(400).json({ message: 'La capacidad debe ser un número entero positivo.' });
    }
    if (datosAlojamiento.latitud !== undefined && datosAlojamiento.latitud !== null) {
        datosAlojamiento.latitud = parseFloat(datosAlojamiento.latitud);
    }
    if (datosAlojamiento.longitud !== undefined && datosAlojamiento.longitud !== null) {
        datosAlojamiento.longitud = parseFloat(datosAlojamiento.longitud);
    }


    const actualizado = await Alojamiento.updateById(id, datosAlojamiento);
    if (!actualizado) {
      // Podría ser que el alojamiento no exista o que no haya campos válidos para actualizar.
      // El modelo Alojamiento.updateById arrojaría error si no hay campos,
      // así que aquí es más probable que el ID no exista.
      const existeAlojamiento = await Alojamiento.findById(id);
      if (!existeAlojamiento) {
          return res.status(404).json({ message: 'Alojamiento no encontrado para actualizar.' });
      }
      return res.status(200).json({ message: 'No se realizaron cambios o los datos enviados eran iguales a los existentes.' });

    }
    const alojamientoActualizado = await Alojamiento.findById(id); // Obtener el objeto actualizado
    res.status(200).json({ message: 'Alojamiento actualizado exitosamente.', alojamiento: alojamientoActualizado });
  } catch (error) {
    if (error.message === "No se proporcionaron datos para actualizar.") {
        return res.status(400).json({ message: error.message });
    }
    console.error('Error al actualizar alojamiento:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el alojamiento.', error: error.message });
  }
};

// Eliminar un alojamiento (solo admin)
exports.deleteAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Alojamiento.deleteById(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Alojamiento no encontrado para eliminar.' });
    }
    res.status(200).json({ message: 'Alojamiento eliminado exitosamente.' });
    // Alternativamente, se puede usar status 204 (No Content) para eliminaciones exitosas sin cuerpo de respuesta.
    // res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar alojamiento:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el alojamiento.', error: error.message });
  }
};