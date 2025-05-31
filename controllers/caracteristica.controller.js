const Caracteristica = require('../models/caracteristica.model');


// Get all features
exports.getAll = async (req, res) => {
  try {
    const caracteristicas = await Caracteristica.findAll();
    res.json(caracteristicas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single feature by ID
exports.getById = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.findByPk(req.params.id);
    if (!caracteristica) {
      return res.status(404).json({ message: 'Feature not found' });
    }
    res.json(caracteristica);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get caracteristica by alojamiento
exports.getCaracteristicaByalojamiento = async (req, res) => {
  try {
    const { id } = req.params; // ID del alojamiento
    const results = await Caracteristica.getCaracteristicas(id);
    
    if (results.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron características para este alojamiento' 
      });
    }    
    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener características',
      error: error.message 
    });
  }
};

// Create new feature
exports.create = async (req, res) => {
  try {
    const { nombre, icono, descripcion } = req.body;
    const newCaracteristica = await Caracteristica.create({
      nombre,
      icono,
      descripcion
    });
    res.status(201).json(newCaracteristica);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update feature
exports.update = async (req, res) => {
  try {
    const { nombre, icono, descripcion } = req.body;
    const [updated] = await Caracteristica.update(
      { nombre, icono, descripcion },
      { where: { id_caracteristica: req.params.id } }
    );
    if (updated) {
      const updatedCaracteristica = await Caracteristica.findByPk(req.params.id);
      res.json(updatedCaracteristica);
    } else {
      res.status(404).json({ message: 'Feature not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete feature
exports.delete = async (req, res) => {
  try {
    const deleted = await Caracteristica.destroy({
      where: { id_caracteristica: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Feature deleted' });
    } else {
      res.status(404).json({ message: 'Feature not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
