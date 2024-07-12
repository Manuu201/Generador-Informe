const express = require('express');
const router = express.Router();
const { Observation } = require('../models');

router.post('/', async (req, res) => {
  try {
    const observation = await Observation.create(req.body);
    res.status(201).json(observation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
