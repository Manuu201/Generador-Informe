// src/components/MachineDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MachineDetails.css';

const MachineDetails = () => {
  const { machineId } = useParams();
  const [submachines, setSubmachines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [observations, setObservations] = useState([]);
  const [newObservation, setNewObservation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const [submachineResponse, taskResponse, observationResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/submachines/${machineId}`),
          axios.get(`http://localhost:3000/api/tasks/${machineId}`),
          axios.get(`http://localhost:3000/api/observations/${machineId}`),
        ]);
        setSubmachines(submachineResponse.data);
        setTasks(taskResponse.data);
        setObservations(observationResponse.data);
      } catch (error) {
        console.error('Error fetching machine details:', error);
      }
    };
    fetchMachineDetails();
  }, [machineId]);

  const handleAddObservation = async () => {
    try {
      await axios.post('http://localhost:3000/api/observations', { machineId, observation: newObservation });
      setNewObservation('');
      // Re-fetch observations to update the list
      const response = await axios.get(`http://localhost:3000/api/observations/${machineId}`);
      setObservations(response.data);
    } catch (error) {
      console.error('Error adding observation:', error);
    }
  };

  const handleCreateReport = () => {
    navigate(`/create-report-final/${machineId}`); // Navega a la vista final del informe
  };

  return (
    <div className="machine-details">
      <h2>Machine Details</h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>Submachine</th>
            <th>Tasks</th>
            <th>Observations</th>
          </tr>
        </thead>
        <tbody>
          {submachines.map((submachine) => (
            <tr key={submachine.id}>
              <td>{submachine.name}</td>
              <td>
                {tasks
                  .filter(task => task.submachineId === submachine.id)
                  .map(task => (
                    <div key={task.id}>
                      <span>{task.description}</span>
                      <input
                        type="checkbox"
                        checked={task.status === 1}
                        onChange={() => {/* Handle status toggle */}}
                      />
                    </div>
                  ))
                }
              </td>
              <td>
                {observations
                  .filter(obs => obs.submachineId === submachine.id)
                  .map(obs => (
                    <div key={obs.id}>{obs.text}</div>
                  ))
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-observation">
        <input
          type="text"
          value={newObservation}
          onChange={(e) => setNewObservation(e.target.value)}
          placeholder="Add new observation"
        />
        <button onClick={handleAddObservation}>Add Observation</button>
      </div>
      <button onClick={handleCreateReport} className="create-report-button">Create Report</button>
    </div>
  );
};

export default MachineDetails;
