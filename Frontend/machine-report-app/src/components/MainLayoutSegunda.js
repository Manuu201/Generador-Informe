// src/components/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css'; // Asegúrate de que este archivo CSS exista
import SidebarSegunda from './SidebarSegunda';

const MainLayoutSegunda = () => {
  return (
    <div className="main-layout">
      <SidebarSegunda />
      <div className="main-content">
        <Outlet /> {/* Renderiza el contenido de la ruta actual aquí */}
      </div>
    </div>
  );
};

export default MainLayoutSegunda;