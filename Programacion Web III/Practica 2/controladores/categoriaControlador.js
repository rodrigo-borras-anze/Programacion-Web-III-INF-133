import { insertaCategoria,  
    obtCategoriaPorId,
    actualizaCategoria, 
    obtTodasCategorias,
    eliminaCategoria} from '../modelos/categoriaModelo.js';

export const crearCategoria = async (req, res) => { 
  try {

    const resultado = await insertaCategoria(req.body); 
    res.status(201).json(resultado); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

export const mostrarCategorias = async (req, res) => {
  try {
    const resultado = await obtTodasCategorias();
    res.status(200).json(resultado); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const mostrarCategoriaPorId = async (req, res) => {
  try {
    const id = req.params.id; 
    const resultado = await obtCategoriaPorId(id);
    if (!resultado) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const actualizarCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body; 
    const resultado = await actualizaCategoria(id, body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const eliminarCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    await eliminaCategoria(id);
    res.status(200).json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};