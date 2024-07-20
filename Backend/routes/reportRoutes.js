// routes/reports.js
const express = require('express');
const router = express.Router();
const { Report, Machine } = require('../models');

// Obtener todos los informes
router.get('/', async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [Machine], // Incluye los datos de la máquina asociada
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo informe
router.post('/', async (req, res) => {
  const { machineId, observations } = req.body;

  try {
    const report = await Report.create({ machineId, observations });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un informe por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findByPk(id, {
      include: [Machine],
    });
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un informe por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { machineId, observations } = req.body;

  try {
    const report = await Report.findByPk(id);
    if (report) {
      report.machineId = machineId;
      report.observations = observations;
      await report.save();
      res.json(report);
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un informe por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findByPk(id);
    if (report) {
      await report.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
