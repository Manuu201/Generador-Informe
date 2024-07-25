import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const SidebarSegunda = () => {
  return (
    <div className="sidebar">
      <div className="menu">
        <h2>Menú</h2>
        <Link to="/" className="back-button">Inicio</Link>
      </div>
    </div>
  );
};

export default SidebarSegunda;
