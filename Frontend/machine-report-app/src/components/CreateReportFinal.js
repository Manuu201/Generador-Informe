// src/components/CreateReportFinal.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CreateReportFinal.css';

const CreateReportFinal = () => {
  const { machineId } = useParams();
  const [observations, setObservations] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reportData = {
      machineId,
      observations,
    };
    try {
      await axios.post('http://localhost:3000/api/reports', reportData);
      alert('Report created successfully!');
      setObservations('');
    } catch (error) {
      console.error('Error creating report:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-report-final">
      <h2>Final Report Creation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Observations:
          <textarea value={observations} onChange={(e) => setObservations(e.target.value)} required />
        </label>
        <button type="submit">Create Report</button>
      </form>
    </div>
  );
};

export default CreateReportFinal;
