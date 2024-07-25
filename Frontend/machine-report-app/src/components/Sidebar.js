// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Asegúrate de que el archivo CSS existe

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu">
        <h2>Menú</h2>
        <ul>
          <li><Link to="/create-entity">Crear Máquina</Link></li>
          <li><Link to="/create-submachine">Crear Submáquina</Link></li>
          <li><Link to="/machine-list">Ver Máquinas</Link></li>
          <li><Link to="/submachine-list/:machineId">Ver Submáquinas</Link></li>
        </ul>
      </div>
      <Link to="/" className="back-button">Inicio</Link>
    </div>
  );
};

export default Sidebar;
