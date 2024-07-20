// src/components/SelectMachine.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SelectMachine.css'; // Add styling if needed

const SelectMachine = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines');
        setMachines(response.data);
      } catch (error) {
        console.error('Error fetching machines:', error);
      }
    };
    fetchMachines();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedMachine) {
      navigate(`/machine-details/${selectedMachine}`);
    }
  };

  return (
    <div className="select-machine">
      <h2>Select Machine</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Machine:
          <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} required>
            <option value="">Select a machine</option>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>{machine.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">View Details</button>
      </form>
    </div>
  );
};

export default SelectMachine;
