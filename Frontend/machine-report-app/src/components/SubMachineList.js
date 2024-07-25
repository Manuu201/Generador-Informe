import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CommonStyles.css';

const SubmachinesList = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [submachines, setSubmachines] = useState([]);

  useEffect(() => {
    // Fetch list of machines for the selector
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines');
        setMachines(response.data);
      } catch (error) {
        console.error('Error fetching machines:', error);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchMachines();
  }, []);

  useEffect(() => {
    // Fetch submachines when a machine is selected
    const fetchSubmachines = async () => {
      if (selectedMachineId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/submachines/machine/${selectedMachineId}`);
          setSubmachines(response.data);
        } catch (error) {
          console.error('Error fetching submachines:', error);
          toast.error(`Error: ${error.message}`);
        }
      }
    };

    fetchSubmachines();
  }, [selectedMachineId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/submachines/${selectedMachineId}/${id}`);
      setSubmachines(submachines.filter(submachine => submachine.id !== id));
      toast.success('Submáquina eliminada con éxito!');
    } catch (error) {
      console.error('Error deleting submachine:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-entity-container">
      <Sidebar />
      <div className="create-entity-content">
        <h2>Lista de Submáquinas</h2>
        <div className="selector-container">
          <label htmlFor="machine-select">Selecciona una máquina:</label>
          <select
            id="machine-select"
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
          >
            <option value="">Selecciona una máquina</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.name}
              </option>
            ))}
          </select>
        </div>
        {selectedMachineId && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Máquina ID</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {submachines.map(submachine => (
                <tr key={submachine.id}>
                  <td>{submachine.id}</td>
                  <td>{submachine.name}</td>
                  <td>{submachine.machineId}</td>
                  <td>
                    <button onClick={() => handleDelete(submachine.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default SubmachinesList;
