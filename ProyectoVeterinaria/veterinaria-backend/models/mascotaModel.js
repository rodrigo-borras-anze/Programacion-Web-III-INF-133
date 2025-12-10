import { pool } from '../config/db.js';

export const obtMascotas = async () => {
    const [resultado] = await pool.query(`
        SELECT m.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM mascotas m
        JOIN clientes c ON m.cliente_id = c.id
        WHERE m.estado = "activo"
    `);
    return resultado;
};

export const obtMascota = async (id) => {
    const [resultado] = await pool.query(`
        SELECT m.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM mascotas m
        JOIN clientes c ON m.cliente_id = c.id
        WHERE m.id = ? AND m.estado = "activo"
    `, [id]);
    return resultado[0];
};

export const obtMascotasPorCliente = async (cliente_id) => {
    const [resultado] = await pool.query(
        'SELECT * FROM mascotas WHERE cliente_id = ? AND estado = "activo"',
        [cliente_id]
    );
    return resultado;
};

export const insertaMascota = async (mascota) => {
    const { cliente_id, nombre, especie, raza, fecha_nacimiento } = mascota;
    const [resultado] = await pool.query(
        'INSERT INTO mascotas (cliente_id, nombre, especie, raza, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)',
        [cliente_id, nombre, especie, raza, fecha_nacimiento]
    );
    return { id: resultado.insertId, ...mascota };
};

export const actualizaMascota = async (id, mascota) => {
    const { nombre, especie, raza, fecha_nacimiento } = mascota;
    await pool.query(
        'UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, fecha_nacimiento = ? WHERE id = ?',
        [nombre, especie, raza, fecha_nacimiento, id]
    );
    return { id, ...mascota };
};

export const eliminaMascota = async (id) => {
    await pool.query('UPDATE mascotas SET estado = "inactivo" WHERE id = ?', [id]);
    return id;
};