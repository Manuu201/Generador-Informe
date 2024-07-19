// src/components/CreateEntity.js
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Asegúrate de tener el componente Sidebar
import './CommonStyles.css'; // Usa el archivo CSS común

const CreateEntity = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/machines', { name, status, location });
      alert('Máquina creada con éxito!');
      setName('');
      setStatus('');
      setLocation('');
    } catch (error) {
      console.error('Error creando la máquina:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-entity-container">
      <Sidebar /> {/* Agrega el Sidebar */}
      <div className="create-entity-content">
        <h2>Crear Máquina</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Estado:
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
          </label>
          <label>
            Ubicación:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>
          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEntity;
