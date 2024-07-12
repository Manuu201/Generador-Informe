const express = require('express');
const router = express.Router();
const { Photo } = require('../models');

router.post('/', async (req, res) => {
  try {
    const photo = await Photo.create(req.body);
    res.status(201).json(photo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
