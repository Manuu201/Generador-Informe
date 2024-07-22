const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Photo } = require('../models');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage });

// POST request to upload image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { machineId, submachineId } = req.body;
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`; // URL to access the image
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

// DELETE request to delete image
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    // Delete the file from the server
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../uploads', photo.url.split('/').pop());
    fs.unlinkSync(filePath);
    await photo.destroy();
    res.status(200).json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
