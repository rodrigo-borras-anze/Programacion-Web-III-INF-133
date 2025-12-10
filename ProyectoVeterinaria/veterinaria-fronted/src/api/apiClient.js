import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// CAPTCHA
export const generarCaptcha = () => api.get('/captcha/generar');

// AUTH
export const registroUsuario = (datos) => api.post('/auth/registro', datos);
export const loginUsuario = (datos) => api.post('/auth/login', datos);

// CLIENTES
export const obtenerClientePerfil = () => api.get('/clientes/mi-perfil');
export const obtenerClientes = () => api.get('/clientes');
export const obtenerCliente = (id) => api.get(`/clientes/${id}`);
export const crearCliente = (datos) => api.post('/clientes', datos);
export const actualizarCliente = (id, datos) => api.put(`/clientes/${id}`, datos);
export const eliminarCliente = (id) => api.delete(`/clientes/${id}`);

// MASCOTAS
export const obtenerMascotas = () => api.get('/mascotas');
export const obtenerMascota = (id) => api.get(`/mascotas/${id}`);
export const obtenerMascotasPorCliente = (clienteId) => api.get(`/mascotas/cliente/${clienteId}`);
export const crearMascota = (datos) => api.post('/mascotas', datos);
export const actualizarMascota = (id, datos) => api.put(`/mascotas/${id}`, datos);
export const eliminarMascota = (id) => api.delete(`/mascotas/${id}`);

// CONSULTAS
export const obtenerConsultas = () => api.get('/consultas');
export const obtenerConsulta = (id) => api.get(`/consultas/${id}`);
export const obtenerConsultasPorMascota = (mascotaId) => api.get(`/consultas/mascota/${mascotaId}`);
export const crearConsulta = (datos) => api.post('/consultas', datos);
export const actualizarConsulta = (id, datos) => api.put(`/consultas/${id}`, datos);
export const eliminarConsulta = (id) => api.delete(`/consultas/${id}`);

// REPORTES
export const descargarReporteConsulta = (consultaId) => api.get(`/reportes/consulta/${consultaId}`, {
  responseType: 'blob'
});

export const descargarReporteCliente = (clienteId) => api.get(`/reportes/cliente/${clienteId}`, {
  responseType: 'blob'
});

export default api;
