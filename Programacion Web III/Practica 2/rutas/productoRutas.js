
import express from 'express';
import { crearProducto } from '../controladores/productoControlador.js';
import { mostrarProductos } from '../controladores/productoControlador.js';
import {  
  mostrarProductoPorId 
} from '../controladores/productoControlador.js';
import { 
  actualizarProducto
} from '../controladores/productoControlador.js';
import { 
  actualizarStock
} from '../controladores/productoControlador.js';

const rutas = express.Router();

rutas.post('/productos', crearProducto);

rutas.get('/productos', mostrarProductos);

rutas.get('/productos/:id', mostrarProductoPorId);

rutas.put('/productos/:id', actualizarProducto);

rutas.patch('/productos/:id/stock', actualizarStock);

export default rutas;