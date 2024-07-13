const express = require('express');
const router = express.Router();
const { Submachine } = require('../models');

// Crear una nueva submáquina
router.post('/', async (req, res) => {
  try {
    const submachine = await Submachine.create(req.body);
    res.status(201).json(submachine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las submáquinas
router.get('/', async (req, res) => {
  try {
    const submachines = await Submachine.findAll();
    res.json(submachines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una submáquina por ID
router.get('/:id', async (req, res) => {
  try {
    const submachine = await Submachine.findByPk(req.params.id);
    if (!submachine) {
      return res.status(404).json({ error: 'Submachine not found' });
    }
    res.json(submachine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener submáquinas por machineId
router.get('/machine/:machineId', async (req, res) => {
  try {
    const submachines = await Submachine.findAll({ where: { machineId: req.params.machineId } });
    res.json(submachines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;