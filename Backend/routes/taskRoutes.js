const express = require('express');
const router = express.Router();
const { Task } = require('../models');

// Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener tareas por machineId o submachineId
router.get('/machine/:machineId', async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { machineId: req.params.machineId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/submachine/:submachineId', async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { submachineId: req.params.submachineId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener tareas por machineId y submachineId
router.get('/:machineId/:submachineId', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        machineId: req.params.machineId,
        submachineId: req.params.submachineId
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
