import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de que el archivo CSS existe

const Navbar = () => {
  return (
    <div className="navbar">
      <h2>Menu</h2>
      <Link to="/create-machine">Crear Máquina</Link>
      <Link to="/create-submachine">Crear Submáquina</Link>
      <Link to="/create-operator">Crear Operador</Link>
      <Link to="/create-line">Crear Línea</Link>
      <Link to="/create-task">Crear Tarea</Link> {/* Nueva opción para crear tarea */}
    </div>
  );
};

export default Navbar;

