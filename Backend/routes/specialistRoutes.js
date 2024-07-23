const express = require('express');
const router = express.Router();
const { Specialist } = require('../models');

// Create Specialist
router.post('/', async (req, res) => {
  try {
    const { machineId, status } = req.body;
    
    // Check if there's already a manager for this machine
    if (status === 1) {
      const existingManager = await Specialist.findOne({ where: { machineId, status: 1 } });
      if (existingManager) {
        return res.status(400).json({ error: 'A manager already exists for this machine.' });
      }
    }

    const specialist = await Specialist.create(req.body);
    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Specialists by Machine
router.get('/machine/:machineId', async (req, res) => {
  try {
    const specialists = await Specialist.findAll({ where: { machineId: req.params.machineId } });
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Specialist
router.put('/:id', async (req, res) => {
  try {
    const specialist = await Specialist.findByPk(req.params.id);
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    if (req.body.status === 1) {
      const existingManager = await Specialist.findOne({ where: { machineId: specialist.machineId, status: 1 } });
      if (existingManager && existingManager.id !== specialist.id) {
        return res.status(400).json({ error: 'A manager already exists for this machine.' });
      }
    }

    await specialist.update(req.body);
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Specialist
router.delete('/:id', async (req, res) => {
  try {
    const specialist = await Specialist.findByPk(req.params.id);
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }
    await specialist.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
