import { pool } from '../config/db.js';

export const obtClientes = async () => {
    const [resultado] = await pool.query(`
        SELECT c.*, u.email, u.rol 
        FROM clientes c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.estado = "activo"
    `);
    return resultado;
};

export const obtCliente = async (id) => {
    const [resultado] = await pool.query(`
        SELECT c.*, u.email, u.rol 
        FROM clientes c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.id = ? AND c.estado = "activo"
    `, [id]);
    return resultado[0];
};

export const obtClientePorUsuarioId = async (usuario_id) => {
    const [resultado] = await pool.query(
        'SELECT * FROM clientes WHERE usuario_id = ? AND estado = "activo"',
        [usuario_id]
    );
    return resultado[0];
};

export const insertaCliente = async (cliente) => {
    const { usuario_id, nombre, apellido, telefono, direccion } = cliente;
    const [resultado] = await pool.query(
        'INSERT INTO clientes (usuario_id, nombre, apellido, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
        [usuario_id, nombre, apellido, telefono, direccion]
    );
    return { id: resultado.insertId, ...cliente };
};

export const actualizaCliente = async (id, cliente) => {
    const { nombre, apellido, telefono, direccion } = cliente;
    await pool.query(
        'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id = ?',
        [nombre, apellido, telefono, direccion, id]
    );
    return { id, ...cliente };
};

export const eliminaCliente = async (id) => {
    await pool.query('UPDATE clientes SET estado = "inactivo" WHERE id = ?', [id]);
    return id;
};