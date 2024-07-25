import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Utiliza el archivo CSS común

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="content">
        <h1>Bienvenido al Generador de Informes</h1>
        <p>Seleccione una opción para comenzar:</p>
        <div className="homepage-actions">
          <Link to="/create-report" className="action-button">Crear Informe</Link>
          <Link to="/create-entity" className="action-button">Crear Entidades</Link>
        </div>
        <div className="homepage-info">
          <p>Accede a las herramientas para gestionar máquinas, submáquinas, tareas y más. Elige una opción a continuación para comenzar a crear o gestionar tus datos.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
