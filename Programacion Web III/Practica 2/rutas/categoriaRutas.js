import express from 'express';
import { crearCategoria, 
    mostrarCategorias,
    mostrarCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
    } from '../controladores/categoriaControlador.js';

const rutas = express.Router();

rutas.post('/categorias', crearCategoria);

rutas.get('/categorias', mostrarCategorias);

rutas.get('/categorias/:id', mostrarCategoriaPorId);

rutas.put('/categorias/:id', actualizarCategoria);

rutas.delete('/categorias/:id', eliminarCategoria);

export default rutas;