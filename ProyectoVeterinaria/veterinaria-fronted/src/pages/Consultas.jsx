import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerConsultasPorMascota, crearConsulta, descargarReporteConsulta } from '../api/apiClient';
import '../styles/Consultas.css';

const Consultas = () => {
  const { mascotaId } = useParams();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    mascota_id: mascotaId,
    motivo: '',
    diagnostico: '',
    tratamiento: ''
  });
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esAdmin = usuario?.rol === 'admin';

  useEffect(() => {
    cargarConsultas();
  }, [mascotaId]);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const response = await obtenerConsultasPorMascota(mascotaId);
      if (response.data.success) {
        setConsultas(response.data.data);
      }
    } catch (err) {
      setError('Error al cargar consultas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.motivo.trim()) {
      setError('El motivo es requerido');
      return;
    }

    try {
      console.log('Enviando:', formData);
      console.log('Usuario rol:', usuario.rol);
      const response = await crearConsulta(formData);
      console.log('Respuesta:', response);
      if (response.data.success) {
        setFormData({
          mascota_id: mascotaId,
          motivo: '',
          diagnostico: '',
          tratamiento: ''
        });
        setShowForm(false);
        cargarConsultas();
      } else {
        setError(response.data.error || 'Error al crear consulta');
      }
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.error || 'Error al crear consulta');
    }
  };

  const descargarPDF = async (consultaId) => {
    try {
      const response = await descargarReporteConsulta(consultaId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consulta-${consultaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Error al descargar PDF');
      console.error(err);
    }
  };

  return (
    <div className="consultas-container">
      <div className="consultas-header">
        <button className="btn btn-back" onClick={() => navigate('/dashboard-cliente')}>← Volver</button>
        <h1>Consultas de la Mascota</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva Consulta'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario Nueva Consulta */}
      {showForm && (
        <form className="consulta-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="motivo">Motivo de la Consulta *</label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleInputChange}
              placeholder="Describe el motivo de la consulta"
              required
            ></textarea>
          </div>

          {esAdmin && (
            <>
              <div className="form-group">
                <label htmlFor="diagnostico">Diagnóstico</label>
                <textarea
                  id="diagnostico"
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  placeholder="Diagnóstico (opcional)"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="tratamiento">Tratamiento</label>
                <textarea
                  id="tratamiento"
                  name="tratamiento"
                  value={formData.tratamiento}
                  onChange={handleInputChange}
                  placeholder="Tratamiento recomendado (opcional)"
                ></textarea>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary">Guardar Consulta</button>
        </form>
      )}

      {/* Listado de Consultas */}
      <section className="consultas-list">
        {loading ? (
          <p>Cargando consultas...</p>
        ) : consultas.length === 0 ? (
          <p className="empty">No hay consultas registradas</p>
        ) : (
          <div className="consultas-timeline">
            {consultas.map(consulta => (
              <div key={consulta.id} className="consulta-item">
                <div className="consulta-date">
                  {new Date(consulta.fecha_consulta).toLocaleDateString('es-ES')}
                </div>
                <div className="consulta-content">
                  <h3>Consulta #{consulta.id}</h3>
                  <p><strong>Motivo:</strong> {consulta.motivo}</p>
                  {consulta.diagnostico && (
                    <p><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>
                  )}
                  {consulta.tratamiento && (
                    <p><strong>Tratamiento:</strong> {consulta.tratamiento}</p>
                  )}
                  <div className="consulta-actions">
                    <button className="btn btn-secondary">Editar</button>
                    <button 
                      className="btn btn-info"
                      onClick={() => descargarPDF(consulta.id)}
                    >
                      📄 Descargar PDF
                    </button>
                    <button className="btn btn-danger">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Consultas;
