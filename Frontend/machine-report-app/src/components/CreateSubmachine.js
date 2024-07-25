import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CommonStyles.css'; // Usa el archivo de estilos común

const CreateSubmachine = () => {
  const [name, setName] = useState('');
  const [machineId, setMachineId] = useState('');
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/machines');
        setMachines(response.data);
      } catch (error) {
        console.error('Error obteniendo las máquinas:', error);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchMachines();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/submachines', { name, machineId });
      toast.success('Submáquina creada con éxito!');
      setName('');
      setMachineId('');
    } catch (error) {
      console.error('Error creando la submáquina:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Crear Submáquina</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Máquina:
          <select value={machineId} onChange={(e) => setMachineId(e.target.value)} required>
            <option value="" disabled>Seleccione una máquina</option>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>{machine.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateSubmachine;
