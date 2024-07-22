// src/components/CreateOperator.js
import React, { useState } from 'react';
import axios from 'axios';
import './CommonStyles.css'; // Asegúrate de tener un archivo CSS

const CreateOperator = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const operatorData = { name, specialty, email };

    try {
      const response = await axios.post('http://localhost:3000/api/operators', operatorData);
      alert('Operador creado exitosamente!');
      setName('');
      setSpecialty('');
      setEmail('');
    } catch (error) {
      console.error('Error creando operador:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-operator">
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
        <label>
          Correo Electrónico:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Crear Operador</button>
      </form>
    </div>
  );
};

export default CreateOperator;
