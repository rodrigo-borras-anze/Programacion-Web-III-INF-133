import { 
    obtMascotas, 
    obtMascota, 
    obtMascotasPorCliente,
    insertaMascota, 
    actualizaMascota, 
    eliminaMascota 
} from '../models/mascotaModel.js';

export const obtenerMascotas = async (req, res) => {
    try {
        const mascotas = await obtMascotas();
        res.json({
            success: true,
            data: mascotas
        });
    } catch (error) {
        console.error('Error obteniendo mascotas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener mascotas' 
        });
    }
};

export const obtenerMascota = async (req, res) => {
    try {
        const { id } = req.params;
        const mascota = await obtMascota(id);
        
        if (!mascota) {
            return res.status(404).json({ 
                success: false,
                error: 'Mascota no encontrada' 
            });
        }
        
        res.json({
            success: true,
            data: mascota
        });
    } catch (error) {
        console.error('Error obteniendo mascota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener mascota' 
        });
    }
};

export const obtenerMascotasPorClienteId = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const mascotas = await obtMascotasPorCliente(clienteId);
        
        res.json({
            success: true,
            data: mascotas
        });
    } catch (error) {
        console.error('Error obteniendo mascotas por cliente:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener mascotas' 
        });
    }
};

export const crearMascota = async (req, res) => {
    try {
        const { cliente_id, nombre, especie, raza, fecha_nacimiento } = req.body;
        
        const mascota = await insertaMascota({
            cliente_id,
            nombre,
            especie,
            raza,
            fecha_nacimiento
        });
        
        res.status(201).json({
            success: true,
            message: 'Mascota creada exitosamente',
            data: mascota
        });
    } catch (error) {
        console.error('Error creando mascota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear mascota' 
        });
    }
};

export const actualizarMascota = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        
        const mascotaExistente = await obtMascota(id);
        if (!mascotaExistente) {
            return res.status(404).json({ 
                success: false,
                error: 'Mascota no encontrada' 
            });
        }
        
        const mascotaActualizada = await actualizaMascota(id, datos);
        res.json({
            success: true,
            message: 'Mascota actualizada exitosamente',
            data: mascotaActualizada
        });
    } catch (error) {
        console.error('Error actualizando mascota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar mascota' 
        });
    }
};

export const eliminarMascota = async (req, res) => {
    try {
        const { id } = req.params;
        const mascotaExistente = await obtMascota(id);
        
        if (!mascotaExistente) {
            return res.status(404).json({ 
                success: false,
                error: 'Mascota no encontrada' 
            });
        }
        
        await eliminaMascota(id);
        
        res.json({
            success: true,
            message: 'Mascota eliminada (lógicamente) exitosamente',
            mascotaId: id
        });
    } catch (error) {
        console.error('Error eliminando mascota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar mascota' 
        });
    }
};