import React, { useState } from 'react';
import axios from 'axios';
import './CommonStyles.css'; // Usa el archivo de estilos común

const CreateOperator = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/operators', { name, description });
      alert('Operador creado con éxito!');
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creando el operador:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Crear Operador</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Descripción:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateOperator;
