const express = require('express');
const router = express.Router();
const { Observation } = require('../models');

// Crear una nueva observación
router.post('/', async (req, res) => {
  try {
    const observation = await Observation.create(req.body);
    res.status(201).json(observation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las observaciones
router.get('/', async (req, res) => {
  try {
    const observations = await Observation.findAll();
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una observación por ID
router.get('/:id', async (req, res) => {
  try {
    const observation = await Observation.findByPk(req.params.id);
    if (!observation) {
      return res.status(404).json({ error: 'Observation not found' });
    }
    res.json(observation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener observaciones por machineId o submachineId
router.get('/machine/:machineId', async (req, res) => {
  try {
    const observations = await Observation.findAll({ where: { machineId: req.params.machineId } });
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/submachine/:submachineId', async (req, res) => {
  try {
    const observations = await Observation.findAll({ where: { submachineId: req.params.submachineId } });
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:machineId/:submachineId', async (req, res) => {
  try {
    const observations = await Observation.findAll({
      where: {
        machineId: req.params.machineId,
        submachineId: req.params.submachineId
      }
    });
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
