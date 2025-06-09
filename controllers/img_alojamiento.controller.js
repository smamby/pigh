// controllers/img_alojamiento.controller.js
const AlojamientoImagen = require('../models/img_alojamiento.model');

const getAllImages = async (req, res) => {
  try {
    const data = await AlojamientoImagen.getAll();
    res.json(data);
  } catch (err) {
    console.error('🔥 Error exacto en getAll:', err);
    res.status(500).json({ error: 'Error al obtener imágenes' });
  }
};

const getImagesByAlojamiento = async (req, res) => {
  try {
    console.log('Controller param alojamiento ID:', req.params.id);
    const idAlojamiento = req.params.id
    const data = await AlojamientoImagen.getByAlojamientoId(idAlojamiento);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener imágenes del alojamiento' });
  }
};

const addImage = async (req, res) => {
  try {
    const newImage = await AlojamientoImagen.addImage(req.body);
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar imagen' });
  }
};

const deleteImage = async (req, res) => {
  try {
    await AlojamientoImagen.deleteImage(req.params.id);
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};

module.exports = {
  getAllImages,
  getImagesByAlojamiento,
  addImage,
  deleteImage,
};