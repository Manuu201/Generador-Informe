// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CommonStyles.css'; // Utiliza el archivo CSS común

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Bienvenido al Generador de Informes</h1>
      <div className="homepage-links">
        <Link to="/create-entity">Crear Entidades</Link>
        <Link to="/create-report">Crear Informe</Link>
      </div>
    </div>
  );
};

export default HomePage;
