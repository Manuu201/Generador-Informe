import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateReport.css'; // Asegúrate de que el archivo CSS existe

const CreateTask = () => {
  const [machines, setMachines] = useState([]);
  const [submachines, setSubmachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedSubmachine, setSelectedSubmachine] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines');
        setMachines(response.data);
      } catch (error) {
        console.error('Error fetching machines:', error);
        toast.error('Error fetching machines');
      }
    };
    fetchMachines();
  }, []);

  useEffect(() => {
    const fetchSubmachines = async () => {
      if (selectedMachine) {
        try {
          const response = await axios.get(`http://localhost:3000/api/submachines/machine/${selectedMachine}`);
          setSubmachines(response.data);
        } catch (error) {
          console.error('Error fetching submachines:', error);
          toast.error('Error fetching submachines');
        }
      } else {
        setSubmachines([]);
      }
    };
    fetchSubmachines();
  }, [selectedMachine]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskData = {
      description,
      machineId: selectedMachine,
      submachineId: selectedSubmachine,
      status,
    };
    try {
      const response = await axios.post('http://localhost:3000/api/tasks', taskData);
      toast.success('Task created successfully!');
      setDescription('');
      setSelectedMachine('');
      setSelectedSubmachine('');
      setStatus('');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-task">
      <h2>Create Task</h2>
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
          Submachine:
          <select value={selectedSubmachine} onChange={(e) => setSelectedSubmachine(e.target.value)} required>
            <option value="">Select a submachine</option>
            {submachines.map((submachine) => (
              <option key={submachine.id} value={submachine.id}>{submachine.name}</option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Status:
          <input type="number" value={status} onChange={(e) => setStatus(e.target.value)} required />
        </label>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
