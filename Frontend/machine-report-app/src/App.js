// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateEntity from './components/CreateEntity';
import CreateSubmachine from './components/CreateSubmachine';
import CreateOperator from './components/CreateOperator';
import CreateLine from './components/CreateLine';
import CreateReport from './components/CreateReport'; // Asegúrate de que existe este componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-entity" element={<CreateEntity />} />
        <Route path="/create-submachine" element={<CreateSubmachine />} />
        <Route path="/create-operator" element={<CreateOperator />} />
        <Route path="/create-line" element={<CreateLine />} />
        <Route path="/create-report" element={<CreateReport />} />
      </Routes>
    </Router>
  );
}

export default App;
