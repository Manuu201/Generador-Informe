const express = require('express');
const router = express.Router();
const { Machine } = require('../models');

router.post('/', async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
