import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearMascota, obtenerClientePerfil } from '../api/apiClient';
import '../styles/Forms.css';

const NuevaMascota = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente_id: '',
    nombre: '',
    especie: '',
    raza: '',
    fecha_nacimiento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre de la mascota es requerido');
      return;
    }

    try {
      setLoading(true);
      const clienteResponse = await obtenerClientePerfil();
      if (clienteResponse.data.success) {
        const datosParaEnviar = {
          ...formData,
          cliente_id: clienteResponse.data.data.id
        };

        const response = await crearMascota(datosParaEnviar);
        if (response.data.success) {
          navigate('/dashboard-cliente');
        }
      }
    } catch (err) {
      setError('Error al crear mascota');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <button className="btn btn-back" onClick={() => navigate('/dashboard-cliente')}>← Volver</button>
        
        <h1>Registrar Nueva Mascota</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Mascota *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Firulais"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <select
              id="especie"
              name="especie"
              value={formData.especie}
              onChange={handleInputChange}
            >
              <option value="">Selecciona una especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Ave">Ave</option>
              <option value="Reptil">Reptil</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input
              type="text"
              id="raza"
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              placeholder="Ej: Labrador"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Mascota'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevaMascota;
