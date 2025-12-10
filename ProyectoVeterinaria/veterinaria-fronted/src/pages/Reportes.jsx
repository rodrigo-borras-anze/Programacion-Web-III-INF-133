import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerConsultas } from '../api/apiClient';
import Menu from '../components/Menu';
import '../styles/Dashboard.css';

export default function Reportes() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    if (!usuario.id) {
      navigate('/login');
      return;
    }
    cargarConsultas();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const cargarConsultas = async () => {
    try {
      setCargando(true);
      setError('');
      console.log('Cargando consultas...');
      const response = await obtenerConsultas();
      console.log('Respuesta completa:', response);
      
      // La API devuelve directamente un array en response.data
      const datos = Array.isArray(response.data) ? response.data : response.data?.data || [];
      console.log('Datos obtenidos:', datos);
      setConsultas(datos);
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al cargar reportes: ' + (err.message || 'Error desconocido'));
      setConsultas([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Menu usuario={usuario} onLogout={handleLogout} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>📊 Reportes</h1>
        </div>

        {cargando && <p style={{ padding: '20px' }}>Cargando...</p>}
        {error && <p style={{ padding: '20px', color: 'red' }}>{error}</p>}
        
        {!cargando && consultas.length === 0 && (
          <p style={{ padding: '20px' }}>No hay reportes disponibles</p>
        )}

        {!cargando && consultas.length > 0 && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>Total de consultas: {consultas.length}</h3>
            {consultas.map((consulta) => (
              <div key={consulta.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <strong>Consulta #{consulta.id}</strong><br/>
                Mascota: {consulta.mascota_nombre}<br/>
                Cliente: {consulta.cliente_nombre}<br/>
                Fecha: {new Date(consulta.fecha_consulta).toLocaleDateString('es-ES')}<br/>
                Motivo: {consulta.motivo}<br/>
                Diagnóstico: {consulta.diagnostico || 'No asignado'}<br/>
                Tratamiento: {consulta.tratamiento || 'No asignado'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
