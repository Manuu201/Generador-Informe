const express = require('express');
const router = express.Router();
const { Specialist } = require('../models');

router.post('/', async (req, res) => {
  try {
    const specialist = await Specialist.create(req.body);
    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
