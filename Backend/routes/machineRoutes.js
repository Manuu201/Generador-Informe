// routes/machines.js
const express = require('express');
const router = express.Router();
const { Machine } = require('../models');

// Crear una nueva máquina (POST)
router.post('/', async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las máquinas (GET)
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.status(200).json(machines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener una máquina por ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (machine) {
      res.status(200).json(machine);
    } else {
      res.status(404).json({ error: 'Machine not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una máquina (PUT)
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Machine.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedMachine = await Machine.findByPk(req.params.id);
      res.status(200).json(updatedMachine);
    } else {
      res.status(404).json({ error: 'Machine not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una máquina (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Machine.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Machine not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
