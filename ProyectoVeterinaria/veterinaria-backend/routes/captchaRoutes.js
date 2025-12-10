import express from 'express';
import { generarCaptcha, verificarCaptcha } from '../controllers/captchaController.js';

const router = express.Router();

// Generarr
router.get('/generar', generarCaptcha);

//  verificar CAPTCHHA
export const middlewareCaptcha = verificarCaptcha;

export default router;
