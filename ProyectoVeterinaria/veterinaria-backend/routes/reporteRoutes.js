import express from 'express';
import { generarReporteConsulta, generarReportePorClienteId } from '../controllers/reporteController.js';
import { verificarToken, esAdmin } from '../middlewares/auth.js';

const router = express.Router();

//  para generar reportes
router.get('/consulta/:consultaId', verificarToken, generarReporteConsulta);
router.get('/cliente/:clienteId', verificarToken, generarReportePorClienteId);

export default router;
