import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateReport.css';

const CreateReport = () => {
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
    <div className="create-report">
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
        <button type="submit" className="proceed-button">Proceed</button>
      </form>
    </div>
  );
};

export default CreateReport;
