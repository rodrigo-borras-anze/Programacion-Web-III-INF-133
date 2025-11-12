import { db } from '../config/db.js';

export const insertaProducto = async (producto) => {
  const { nombre, precio, stock, categoria_id } = producto;
  const q = "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?, ?, ?, ?)";
  const [resultado] = await db.query(q, [nombre, precio, stock, categoria_id]);
  return { id: resultado.insertId, ...producto };
};
export const obtTodosProductos = async () => {
  const q = `
    SELECT p.id, p.nombre, p.precio, p.stock, p.categoria_id, c.nombre AS nombre_categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
  `;
  const [resultado] = await db.query(q);
  return resultado;
};
export const obtProductoPorId = async (id) => {
  const q = `
    SELECT p.id, p.nombre, p.precio, p.stock, p.categoria_id, c.nombre AS nombre_categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `;
  const [resultado] = await db.query(q, [id]);
  return resultado.length > 0 ? resultado[0] : null;
};
export const actualizaProducto = async (id, producto) => {
  const { nombre, precio, stock, categoria_id } = producto;
  const q = "UPDATE productos SET nombre = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?";
  
  await db.query(q, [nombre, precio, stock, categoria_id, id]);
  return { id, ...producto };
};
export const actualizaStock = async (id, cantidad) => {
  const q = "UPDATE productos SET stock = stock + ? WHERE id = ?";
  await db.query(q, [cantidad, id]);
  const [resultado] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
  return resultado[0];
};