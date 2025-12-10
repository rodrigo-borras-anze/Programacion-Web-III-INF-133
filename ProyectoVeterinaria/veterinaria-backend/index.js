import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import mascotaRoutes from './routes/mascotaRoutes.js';
import consultaRoutes from './routes/consultaRoutes.js';
import captchaRoutes from './routes/captchaRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';
import { verificarToken } from './middlewares/auth.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/captcha', captchaRoutes);
app.use('/api/reportes', reporteRoutes);

// Prueba 
app.get('/ping', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend de veterinaria funcionando',
        timestamp: new Date().toISOString()
    });
});

// Ruta para verificar permisos según rol
app.get('/api/perfil', verificarToken, (req, res) => {
    res.json({
        usuarioId: req.usuarioId,
        rol: req.usuarioRol,
        message: 'Acceso autorizado'
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});