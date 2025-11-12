import { db } from '../config/db.js';

export const insertaCategoria = async (categoria) => {
  const { nombre, descripcion } = categoria; 
  const q = "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)"; 
  
  try {
    const [resultado] = await db.query(q, [nombre, descripcion]); 
    
    return { id: resultado.insertId, ...categoria };
  } catch (error) {
    console.log(error);
    throw new Error('Error al insertar categoría');
  }
};

export const obtTodasCategorias = async () => {
  const [resultado] = await db.query('SELECT * FROM categorias');
  return resultado;
};

export const obtCategoriaPorId = async (id) => {
  
  const [categoria] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
  
  if (categoria.length === 0) {
    return null;
  }
  
  const [productos] = await db.query('SELECT * FROM productos WHERE categoria_id = ?', [id]);
  
  return { ...categoria[0], productos: productos };
};

export const actualizaCategoria = async (id, categoria) => {
  const { nombre, descripcion } = categoria;
  const q = "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?";

  await db.query(q, [nombre, descripcion, id]);
  
  return { id, ...categoria };
};
export const eliminaCategoria = async (id) => {
  await db.query('DELETE FROM categorias WHERE id = ?', [id]);
  return id;
};