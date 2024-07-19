// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Asegúrate de que el archivo CSS existe

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menú</h2>
      <ul>
        <li><Link to="/create-machine">Crear Máquina</Link></li>
        <li><Link to="/create-submachine">Crear Submáquina</Link></li>
        <li><Link to="/create-operator">Crear Operador</Link></li>
        <li><Link to="/create-line">Crear Línea</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
