import { 
    obtConsultas, 
    obtConsulta, 
    obtConsultasPorMascota,
    insertaConsulta, 
    actualizaConsulta, 
    eliminaConsulta 
} from '../models/consultaModel.js';
import { obtMascota } from '../models/mascotaModel.js';
import { obtClientePorUsuarioId } from '../models/clienteModel.js';

export const obtenerConsultas = async (req, res) => {
    try {
        const consultas = await obtConsultas();
        res.json({
            success: true,
            data: consultas
        });
    } catch (error) {
        console.error('Error obteniendo consultas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener consultas' 
        });
    }
};

export const obtenerConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = await obtConsulta(id);
        
        if (!consulta) {
            return res.status(404).json({ 
                success: false,
                error: 'Consulta no encontrada' 
            });
        }
        
        res.json({
            success: true,
            data: consulta
        });
    } catch (error) {
        console.error('Error obteniendo consulta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener consulta' 
        });
    }
};

export const obtenerConsultasPorMascotaId = async (req, res) => {
    try {
        const { mascotaId } = req.params;
        const consultas = await obtConsultasPorMascota(mascotaId);
        
        res.json({
            success: true,
            data: consultas
        });
    } catch (error) {
        console.error('Error obteniendo consultas por mascota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener consultas' 
        });
    }
};

export const crearConsulta = async (req, res) => {
    try {
        const { mascota_id, fecha_consulta, motivo, diagnostico, tratamiento } = req.body;

        // Si el usuario no es admin
        let diag = diagnostico || null;
        let trat = tratamiento || null;
        if (req.usuarioRol !== 'admin') {
            // Verificar que la mascota pertenezca al cliente 
            const cliente = await obtClientePorUsuarioId(req.usuarioId);
            if (!cliente) {
                return res.status(403).json({ success: false, error: 'Acceso denegado' });
            }

            const mascota = await obtMascota(mascota_id);
            if (!mascota || mascota.cliente_id !== cliente.id) {
                return res.status(403).json({ success: false, error: 'No puedes crear consultas para esta mascota' });
            }

            diag = null;
            trat = null;
        }

        const consulta = await insertaConsulta({
            mascota_id,
            fecha_consulta: fecha_consulta || new Date(),
            motivo,
            diagnostico: diag,
            tratamiento: trat
        });
        
        res.status(201).json({
            success: true,
            message: 'Consulta creada exitosamente',
            data: consulta
        });
    } catch (error) {
        console.error('Error creando consulta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear consulta' 
        });
    }
};

export const actualizarConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        
        const consultaExistente = await obtConsulta(id);
        if (!consultaExistente) {
            return res.status(404).json({ 
                success: false,
                error: 'Consulta no encontrada' 
            });
        }
        // Si el usuario no es admin, evitar que modifique diagnóstico
        if (req.usuarioRol !== 'admin') {
            if ('diagnostico' in datos) delete datos.diagnostico;
            if ('tratamiento' in datos) delete datos.tratamiento;

            // verificar que la consulta pertenezca a una mascota del cliente
            const cliente = await obtClientePorUsuarioId(req.usuarioId);
            if (!cliente) {
                return res.status(403).json({ success: false, error: 'Acceso denegado' });
            }

            const mascota = await obtMascota(consultaExistente.mascota_id);
            if (!mascota || mascota.cliente_id !== cliente.id) {
                return res.status(403).json({ success: false, error: 'No puedes modificar esta consulta' });
            }
        }

        const consultaActualizada = await actualizaConsulta(id, datos);
        res.json({
            success: true,
            message: 'Consulta actualizada exitosamente',
            data: consultaActualizada
        });
    } catch (error) {
        console.error('Error actualizando consulta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar consulta' 
        });
    }
};

export const eliminarConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const consultaExistente = await obtConsulta(id);
        
        if (!consultaExistente) {
            return res.status(404).json({ 
                success: false,
                error: 'Consulta no encontrada' 
            });
        }
        
        // Si no es admin verificar que la consulta pertenezca a una mascota del cliente
        if (req.usuarioRol !== 'admin') {
            const cliente = await obtClientePorUsuarioId(req.usuarioId);
            if (!cliente) {
                return res.status(403).json({ success: false, error: 'Acceso denegado' });
            }

            const mascota = await obtMascota(consultaExistente.mascota_id);
            if (!mascota || mascota.cliente_id !== cliente.id) {
                return res.status(403).json({ success: false, error: 'No puedes eliminar esta consulta' });
            }
        }

        await eliminaConsulta(id);
        
        res.json({
            success: true,
            message: 'Consulta eliminada (lógicamente) exitosamente',
            consultaId: id
        });
    } catch (error) {
        console.error('Error eliminando consulta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar consulta' 
        });
    }
};