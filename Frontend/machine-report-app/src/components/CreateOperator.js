import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CommonStyles.css'; // Usa el archivo de estilos común

const CreateOperator = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/operators', { name, specialty });
      toast.success('Operador creado con éxito!');
      setName('');
      setSpecialty('');
    } catch (error) {
      console.error('Error creando el operador:', error);
      toast.error(`Error: ${error.message}`);
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
          Especialidad:
          <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateOperator;
