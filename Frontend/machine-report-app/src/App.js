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
import MainLayoutSegunda from './components/MainLayoutSegunda';
import MachinesList from './components/MachineList';
import SubmachinesList from './components/SubMachineList';

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
          <Route path="/machine-list" element={<MachinesList/>} />
          <Route path="/submachine-list/:machineId" element={<SubmachinesList />} />
        </Route>
        <Route element={<MainLayoutSegunda />}>
          <Route path="/create-report" element={<CreateReport />} /> {/* Elimina de MainLayout */}
          <Route path="/machine-details/:machineId" element={<MachineDetails />} />
          <Route path="/create-report-final/:machineId" element={<CreateReportFinal />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
