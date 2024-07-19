import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/create-entity">Crear Entidad</Link></li>
        <li><Link to="/create-report">Crear Informe</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
