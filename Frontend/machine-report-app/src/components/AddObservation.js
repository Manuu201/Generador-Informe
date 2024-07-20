// src/components/AddObservation.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddObservation.css'; // Asegúrate de que este archivo CSS exista

const AddObservation = () => {
  const [observation, setObservation] = useState('');
  const [machineId, setMachineId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/observations', { observation, machineId });
      alert('Observation added successfully!');
      setObservation('');
      setMachineId('');
    } catch (error) {
      console.error('Error adding observation:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="add-observation">
      <h2>Add Observation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Observation:
          <textarea value={observation} onChange={(e) => setObservation(e.target.value)} required />
        </label>
        <label>
          Machine ID:
          <input type="number" value={machineId} onChange={(e) => setMachineId(e.target.value)} required />
        </label>
        <button type="submit">Add Observation</button>
      </form>
    </div>
  );
};

export default AddObservation;
