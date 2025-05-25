const express = require('express');
const router = express.Router();
const controller = require('../controllers/img_alojamiento.controller');

router.get('/', controller.getAllImages);
router.get('/:id', controller.getImagesByAlojamiento);
router.post('/', controller.addImage);
router.delete('/:id', controller.deleteImage);

module.exports = router;
