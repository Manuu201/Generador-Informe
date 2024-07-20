import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CommonStyles.css'; // Usa el archivo de estilos común

const CreateLine = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/lines', { name, location });
      toast.success('Línea creada con éxito!');
      setName('');
      setLocation('');
    } catch (error) {
      console.error('Error creando la línea:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Crear Línea</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Ubicación:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateLine;
