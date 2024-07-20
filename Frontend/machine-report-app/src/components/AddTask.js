// src/components/AddTask.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddTask.css'; // Asegúrate de que este archivo CSS exista

const AddTask = () => {
  const [description, setDescription] = useState('');
  const [machineId, setMachineId] = useState('');
  const [submachineId, setSubmachineId] = useState('');
  const [status, setStatus] = useState(0); // 0 = No completada, 1 = Completada

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/tasks', { description, machineId, submachineId, status });
      alert('Task added successfully!');
      setDescription('');
      setMachineId('');
      setSubmachineId('');
      setStatus(0);
    } catch (error) {
      console.error('Error adding task:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="add-task">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Machine ID:
          <input type="number" value={machineId} onChange={(e) => setMachineId(e.target.value)} required />
        </label>
        <label>
          Submachine ID:
          <input type="number" value={submachineId} onChange={(e) => setSubmachineId(e.target.value)} required />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(Number(e.target.value))} required>
            <option value={0}>Not Completed</option>
            <option value={1}>Completed</option>
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
