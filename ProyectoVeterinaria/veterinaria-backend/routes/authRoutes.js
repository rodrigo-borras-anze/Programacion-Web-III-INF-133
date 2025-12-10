import express from 'express';
import { registrar, login } from '../controllers/authController.js';
import { validarRegistro, validarLogin } from '../middlewares/validaciones.js';
import { verificarCaptcha } from '../controllers/captchaController.js';

const router = express.Router();

// Captchha
router.post('/registro', validarRegistro, verificarCaptcha, registrar);
router.post('/login', validarLogin, verificarCaptcha, login);

export default router;