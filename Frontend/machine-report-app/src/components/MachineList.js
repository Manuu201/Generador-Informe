import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CommonStyles.css';

const MachinesList = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/machines/${id}`);
      setMachines(machines.filter(machine => machine.id !== id));
      toast.success('Máquina eliminada con éxito!');
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-entity-container">
      <Sidebar />
      <div className="create-entity-content">
        <h2>Lista de Máquinas</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(machine => (
              <tr key={machine.id}>
                <td>{machine.id}</td>
                <td>{machine.name}</td>
                <td>{machine.status}</td>
                <td>{machine.location}</td>
                <td>
                  <button onClick={() => handleDelete(machine.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
};

export default MachinesList;
