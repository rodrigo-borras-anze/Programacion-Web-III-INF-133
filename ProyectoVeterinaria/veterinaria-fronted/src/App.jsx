import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardCliente from './pages/DashboardCliente';
import Consultas from './pages/Consultas';
import NuevaMascota from './pages/NuevaMascota';
import Reportes from './pages/Reportes';
import './styles/Global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/consultas/:mascotaId" element={<Consultas />} />
        <Route path="/nueva-mascota" element={<NuevaMascota />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
