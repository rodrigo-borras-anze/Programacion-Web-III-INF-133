import express from 'express';
import { 
    obtenerMascotas, 
    obtenerMascota, 
    obtenerMascotasPorClienteId,
    crearMascota, 
    actualizarMascota, 
    eliminarMascota 
} from '../controllers/mascotaController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validarMascota } from '../middlewares/validaciones.js';

const router = express.Router();

// autenticacion
router.use(verificarToken);

router.get('/', obtenerMascotas);
router.get('/cliente/:clienteId', obtenerMascotasPorClienteId);
router.get('/:id', obtenerMascota);
router.post('/', validarMascota, crearMascota);
router.put('/:id', validarMascota, actualizarMascota);
router.delete('/:id', eliminarMascota);

export default router;