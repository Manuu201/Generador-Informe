const express = require('express');
const router = express.Router();
const { Line } = require('../models');

router.post('/', async (req, res) => {
  try {
    const line = await Line.create(req.body);
    res.status(201).json(line);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
