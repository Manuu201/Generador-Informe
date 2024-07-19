import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateReport.css'; // Asegúrate de que el archivo CSS existe

const CreateReport = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [observations, setObservations] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reportData = {
      machineId: selectedMachine,
      observations,
    };
    try {
      const response = await axios.post('http://localhost:3000/api/reports', reportData);
      alert('Report created successfully!');
      setSelectedMachine('');
      setObservations('');
    } catch (error) {
      console.error('Error creating report:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-report">
      <h2>Create Report</h2>
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
        <label>
          Observations:
          <textarea value={observations} onChange={(e) => setObservations(e.target.value)} required />
        </label>
        <button type="submit">Create Report</button>
      </form>
    </div>
  );
};

export default CreateReport;
