import express from 'express';
import { 
    obtenerConsultas, 
    obtenerConsulta, 
    obtenerConsultasPorMascotaId,
    crearConsulta, 
    actualizarConsulta, 
    eliminarConsulta 
} from '../controllers/consultaController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validarConsulta, validarActualizacionConsulta } from '../middlewares/validaciones.js';

const router = express.Router();

// autenticacion
router.use(verificarToken);

router.get('/', obtenerConsultas);
router.get('/mascota/:mascotaId', obtenerConsultasPorMascotaId);
router.get('/:id', obtenerConsulta);
router.post('/', validarConsulta, crearConsulta);
router.put('/:id', validarActualizacionConsulta, actualizarConsulta);
router.delete('/:id', eliminarConsulta);

export default router;