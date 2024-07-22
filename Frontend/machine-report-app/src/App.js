// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateEntity from './components/CreateEntity';
import CreateSubmachine from './components/CreateSubmachine';
import CreateOperator from './components/CreateOperator';
import CreateLine from './components/CreateLine';
import CreateReport from './components/CreateReport';
import CreateTask from './components/CreateTask';
import AddTask from './components/AddTask';
import AddSubmachine from './components/AddSubmachine';
import AddObservation from './components/AddObservation';
import MachineDetails from './components/MachineDetails'; // Importa el nuevo componente
import MainLayout from './components/MainLayout';
import CreateReportFinal from './components/CreateReportFinal';
import CreateEntityLayout from './components/CreateEntityLayout'; // Importa el nuevo layout

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<CreateEntityLayout />}> {/* Usa el nuevo layout para CreateEntity */}
          <Route path="/create-entity" element={<CreateEntity />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/create-submachine" element={<CreateSubmachine />} />
          <Route path="/create-operator" element={<CreateOperator />} />
          <Route path="/create-line" element={<CreateLine />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/add-submachine" element={<AddSubmachine />} />
          <Route path="/add-observation" element={<AddObservation />} />
          <Route path="/machine-details/:machineId" element={<MachineDetails />} /> {/* Nueva ruta */}
          <Route path="/create-report-final/:machineId" element={<CreateReportFinal />} /> {/* Ruta para crear el informe final */}
        </Route>
        <Route path="/create-report" element={<CreateReport />} /> {/* Elimina de MainLayout */}
      </Routes>
    </Router>
  );
}

export default App;
