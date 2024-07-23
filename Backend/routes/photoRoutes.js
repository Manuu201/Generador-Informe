const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Photo } = require('../models'); // Ajusta la ruta según tu estructura de proyecto

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/'); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Añadir timestamp al nombre del archivo
  }
});

const upload = multer({ storage });

// POST request para subir imagen
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { machineId, submachineId } = req.body;
    const imageUrl = `http://localhost:3000/imagenes/${req.file.filename}`; // URL para acceder a la imagen
    const photo = await Photo.create({
      url: imageUrl,
      machineId,
      submachineId
    });
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request para obtener todas las fotos de una submáquina
router.get('/submachine/:id', async (req, res) => {
  try {
    const photos = await Photo.findAll({ where: { submachineId: req.params.id } });
    res.status(200).json(photos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE request para borrar una imagen
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    // Borrar el archivo del servidor
    const fs = require('fs');
    const filePath = path.join(__dirname, '../imagenes', path.basename(photo.url));
    fs.unlinkSync(filePath);
    await photo.destroy();
    res.status(200).json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
