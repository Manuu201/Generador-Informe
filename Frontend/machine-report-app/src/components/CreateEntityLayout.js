// src/components/CreateEntityLayout.js
import React from 'react';
import Sidebar from './Sidebar'; // Suponiendo que tienes un componente Sidebar
import { Outlet } from 'react-router-dom';
import './CreateEntityLayout.css'; // Agrega cualquier estilo específico para este layout

const CreateEntityLayout = () => {
  return (
    <div className="create-entity-layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default CreateEntityLayout;
