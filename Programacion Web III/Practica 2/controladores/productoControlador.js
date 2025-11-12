import { insertaProducto, 
    obtTodosProductos, 
    obtProductoPorId, 
    actualizaProducto,
    actualizaStock } from '../modelos/productoModelo.js';

export const crearProducto = async (req, res) => {
  try {
    const resultado = await insertaProducto(req.body);
    res.status(201).json(resultado); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const mostrarProductos = async (req, res) => {
  try {
    const resultado = await obtTodosProductos();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const mostrarProductoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await obtProductoPorId(id);
    
    if (!resultado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const actualizarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    const resultado = await actualizaProducto(id, body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const actualizarStock = async (req, res) => {
  try {
    const id = req.params.id;
    const { cantidad } = req.body; 
    
    if (typeof cantidad !== 'number') {
      return res.status(400).json({ message: 'La cantidad debe ser un número.' });
    }
    const resultado = await actualizaStock(id, cantidad);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};