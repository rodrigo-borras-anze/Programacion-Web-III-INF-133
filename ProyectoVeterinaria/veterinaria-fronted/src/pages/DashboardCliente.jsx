import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import '../styles/Dashboard.css';
import { obtenerClientePerfil, obtenerMascotasPorCliente } from '../api/apiClient';

const DashboardCliente = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const usuarioStored = localStorage.getItem('usuario');
    if (!usuarioStored) {
      navigate('/login');
      return;
    }

    const usuarioParsed = JSON.parse(usuarioStored);
    if (usuarioParsed.rol === 'admin') {
      navigate('/dashboard-admin');
      return;
    }

    setUsuario(usuarioParsed);
    cargarDatos(usuarioParsed.id);
  }, [navigate]);

  const cargarDatos = async (usuarioId) => {
    try {
      setLoading(true);
      const responseCliente = await obtenerClientePerfil();
      if (responseCliente.data.success) {
        const clienteData = responseCliente.data.data;
        setCliente(clienteData);
        
        // Cargar mascotas del cliente
        const responseMascotas = await obtenerMascotasPorCliente(clienteData.id);
        if (responseMascotas.data.success) {
          setMascotas(responseMascotas.data.data);
        }
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const navegarAConsultas = (mascotaId) => {
    navigate(`/consultas/${mascotaId}`);
  };

  const navegarANuevaMascota = () => {
    navigate('/nueva-mascota');
  };

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="dashboard-container">
      <Menu usuario={usuario} onLogout={handleLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Cliente</h1>
          <p>Bienvenido, <strong>{usuario.email}</strong></p>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {/* Información del Cliente */}
            <section className="cliente-info">
              <h2>Mi Información</h2>
              {cliente && (
                <div className="info-card">
                  <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellido}</p>
                  <p><strong>Email:</strong> {cliente.email}</p>
                  <p><strong>Teléfono:</strong> {cliente.telefono || 'No registrado'}</p>
                  <p><strong>Dirección:</strong> {cliente.direccion || 'No registrada'}</p>
                </div>
              )}
            </section>

            {/* Mascotas */}
            <section className="mascotas-section">
              <div className="section-header">
                <h2>Mis Mascotas</h2>
                <button className="btn btn-primary" onClick={navegarANuevaMascota}>
                  + Agregar Mascota
                </button>
              </div>

              {mascotas.length === 0 ? (
                <p className="empty">No tienes mascotas registradas. Agrega una para hacer consultas.</p>
              ) : (
                <div className="mascotas-grid">
                  {mascotas.map(mascota => (
                    <div key={mascota.id} className="mascota-card">
                      <h3>{mascota.nombre}</h3>
                      <p><strong>Especie:</strong> {mascota.especie || 'No especificada'}</p>
                      <p><strong>Raza:</strong> {mascota.raza || 'No especificada'}</p>
                      {mascota.fecha_nacimiento && (
                        <p><strong>Fecha Nacimiento:</strong> {new Date(mascota.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                      )}
                      <div className="mascota-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => navegarAConsultas(mascota.id)}
                        >
                          Ver Consultas
                        </button>
                        <button className="btn btn-secondary">Editar</button>
                        <button className="btn btn-danger">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCliente;
