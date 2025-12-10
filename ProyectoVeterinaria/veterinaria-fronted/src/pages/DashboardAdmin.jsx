import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import '../styles/Dashboard.css';
import { obtenerConsultas, actualizarConsulta, descargarReporteConsulta } from '../api/apiClient';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [consultaEditando, setConsultaEditando] = useState(null);
  const [formData, setFormData] = useState({
    diagnostico: '',
    tratamiento: ''
  });

  useEffect(() => {
    const usuarioStored = localStorage.getItem('usuario');
    if (!usuarioStored) {
      navigate('/login');
      return;
    }

    const usuarioParsed = JSON.parse(usuarioStored);
    if (usuarioParsed.rol !== 'admin') {
      navigate('/dashboard-cliente');
      return;
    }

    setUsuario(usuarioParsed);
    cargarConsultas();
  }, [navigate]);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const response = await obtenerConsultas();
      console.log('Respuesta de consultas:', response);
      const data = response.data && Array.isArray(response.data) ? response.data : response.data?.data || [];
      setConsultas(data);
    } catch (err) {
      setError('Error al cargar consultas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarConsulta = (consulta) => {
    setConsultaEditando(consulta);
    setFormData({
      diagnostico: consulta.diagnostico || '',
      tratamiento: consulta.tratamiento || ''
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await actualizarConsulta(consultaEditando.id, formData);
      setError('');
      cargarConsultas();
      setConsultaEditando(null);
      alert('Consulta actualizada correctamente');
    } catch (err) {
      setError('Error al guardar');
      console.error(err);
    }
  };

  const descargarPDF = async (consultaId) => {
    try {
      const response = await descargarReporteConsulta(consultaId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-consulta-${consultaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Error al descargar PDF');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!usuario) return <div>Cargando...</div>;

  const consultasPendientes = consultas.filter(c => !c.diagnostico || !c.tratamiento);

  return (
    <div className="dashboard-container">
      <Menu usuario={usuario} onLogout={handleLogout} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Administrador</h1>
          <p>Gestión de Consultas Pendientes</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Estadísticas */}
        <div className="estadisticas">
          <div className="estadistica-card">
            <h3>Consultas Totales</h3>
            <p className="numero">{consultas.length}</p>
          </div>
          <div className="estadistica-card">
            <h3>Pendientes</h3>
            <p className="numero">{consultasPendientes.length}</p>
          </div>
          <div className="estadistica-card">
            <h3>Completadas</h3>
            <p className="numero">{consultas.length - consultasPendientes.length}</p>
          </div>
        </div>

        {/* Tabla de Consultas */}
        <section className="consultas-section">
          <h2>Consultas Pendientes de Diagnóstico/Tratamiento</h2>
          
          {loading ? (
            <p>Cargando consultas...</p>
          ) : consultasPendientes.length === 0 ? (
            <p className="empty">✓ Todas las consultas están completas</p>
          ) : (
            <div className="table-responsive">
              <table className="consultas-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mascota</th>
                    <th>Cliente</th>
                    <th>Motivo</th>
                    <th>Diagnóstico</th>
                    <th>Tratamiento</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {consultasPendientes.map(consulta => (
                    <tr key={consulta.id}>
                      <td>#{consulta.id}</td>
                      <td><strong>{consulta.mascota_nombre}</strong></td>
                      <td>{consulta.cliente_nombre} {consulta.cliente_apellido}</td>
                      <td>{consulta.motivo.substring(0, 25)}...</td>
                      <td>
                        <span className={consulta.diagnostico ? 'badge-success' : 'badge-pending'}>
                          {consulta.diagnostico ? '✓' : '⏳ Pendiente'}
                        </span>
                      </td>
                      <td>
                        <span className={consulta.tratamiento ? 'badge-success' : 'badge-pending'}>
                          {consulta.tratamiento ? '✓' : '⏳ Pendiente'}
                        </span>
                      </td>
                      <td>{new Date(consulta.fecha_consulta).toLocaleDateString('es-ES')}</td>
                      <td>
                        <button 
                          className="btn btn-small btn-info"
                          onClick={() => handleEditarConsulta(consulta)}
                        >
                          ✎ Editar
                        </button>
                        <button 
                          className="btn btn-small btn-success"
                          onClick={() => descargarPDF(consulta.id)}
                        >
                          📄 PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modal de Edición */}
        {consultaEditando && (
          <div className="modal-overlay" onClick={() => setConsultaEditando(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Editar Consulta #{consultaEditando.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setConsultaEditando(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="consulta-info-box">
                  <p><strong>Mascota:</strong> {consultaEditando.mascota_nombre} ({consultaEditando.especie})</p>
                  <p><strong>Cliente:</strong> {consultaEditando.cliente_nombre} {consultaEditando.cliente_apellido}</p>
                  <p><strong>Motivo:</strong> {consultaEditando.motivo}</p>
                </div>

                <form onSubmit={handleGuardar}>
                  <div className="form-group">
                    <label htmlFor="diagnostico">Diagnóstico *</label>
                    <textarea
                      id="diagnostico"
                      value={formData.diagnostico}
                      onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                      placeholder="Ingresa el diagnóstico"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tratamiento">Tratamiento Recomendado *</label>
                    <textarea
                      id="tratamiento"
                      value={formData.tratamiento}
                      onChange={(e) => setFormData({...formData, tratamiento: e.target.value})}
                      placeholder="Ingresa el tratamiento recomendado"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="btn btn-success">
                      💾 Guardar Cambios
                    </button>
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setConsultaEditando(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
