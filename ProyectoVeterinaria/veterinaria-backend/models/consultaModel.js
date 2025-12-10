import { pool } from '../config/db.js';

export const obtConsultas = async () => {
    const [resultado] = await pool.query(`
        SELECT co.*, m.nombre as mascota_nombre, c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM consultas co
        JOIN mascotas m ON co.mascota_id = m.id
        JOIN clientes c ON m.cliente_id = c.id
        WHERE co.estado = "activo"
        ORDER BY co.fecha_consulta DESC
    `);
    return resultado;
};

export const obtConsulta = async (id) => {
    const [resultado] = await pool.query(`
        SELECT co.*, m.nombre as mascota_nombre, m.especie, m.raza,
               c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM consultas co
        JOIN mascotas m ON co.mascota_id = m.id
        JOIN clientes c ON m.cliente_id = c.id
        WHERE co.id = ? AND co.estado = "activo"
    `, [id]);
    return resultado[0];
};

export const obtConsultasPorMascota = async (mascota_id) => {
    const [resultado] = await pool.query(
        'SELECT * FROM consultas WHERE mascota_id = ? AND estado = "activo" ORDER BY fecha_consulta DESC',
        [mascota_id]
    );
    return resultado;
};

export const insertaConsulta = async (consulta) => {
    const { mascota_id, fecha_consulta, motivo, diagnostico, tratamiento } = consulta;
    const [resultado] = await pool.query(
        'INSERT INTO consultas (mascota_id, fecha_consulta, motivo, diagnostico, tratamiento) VALUES (?, ?, ?, ?, ?)',
        [mascota_id, fecha_consulta, motivo, diagnostico, tratamiento]
    );
    return { id: resultado.insertId, ...consulta };
};

export const actualizaConsulta = async (id, consulta) => {
    const campos = [];
    const valores = [];
    
    if ('fecha_consulta' in consulta && consulta.fecha_consulta !== undefined) {
        campos.push('fecha_consulta = ?');
        valores.push(consulta.fecha_consulta);
    }
    if ('motivo' in consulta && consulta.motivo !== undefined) {
        campos.push('motivo = ?');
        valores.push(consulta.motivo);
    }
    if ('diagnostico' in consulta && consulta.diagnostico !== undefined) {
        campos.push('diagnostico = ?');
        valores.push(consulta.diagnostico);
    }
    if ('tratamiento' in consulta && consulta.tratamiento !== undefined) {
        campos.push('tratamiento = ?');
        valores.push(consulta.tratamiento);
    }
    
    if (campos.length === 0) {
        return { id, ...consulta };
    }
    
    valores.push(id);
    const query = `UPDATE consultas SET ${campos.join(', ')} WHERE id = ?`;
    
    await pool.query(query, valores);
    return { id, ...consulta };
};

export const eliminaConsulta = async (id) => {
    await pool.query('UPDATE consultas SET estado = "inactivo" WHERE id = ?', [id]);
    return id;
};