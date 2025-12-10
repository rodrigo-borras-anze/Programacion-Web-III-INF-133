import { body, validationResult } from 'express-validator';

export const validarRegistro = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])/)
        .withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/^(?=.*[A-Z])/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula'),
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido')
        .trim()
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isLength({ min: 2 })
        .withMessage('El apellido debe tener al menos 2 caracteres'),
    body('rol')
        .optional()
        .isIn(['cliente', 'admin'])
        .withMessage('Rol inválido'),
    body('captchaId')
        .notEmpty()
        .withMessage('CAPTCHA ID es requerido'),
    body('captchaText')
        .notEmpty()
        .withMessage('Respuesta del CAPTCHA es requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

export const validarLogin = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Contraseña requerida'),
    body('captchaId')
        .notEmpty()
        .withMessage('CAPTCHA ID es requerido'),
    body('captchaText')
        .notEmpty()
        .withMessage('Respuesta del CAPTCHA es requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

// para cliente
export const validarCliente = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido')
        .trim()
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isLength({ min: 2 })
        .withMessage('El apellido debe tener al menos 2 caracteres'),
    body('telefono')
        .optional()
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Formato de teléfono inválido'),
    body('direccion')
        .optional()
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

// para mascota
export const validarMascota = [
    body('cliente_id')
        .isInt({ gt: 0 })
        .withMessage('Cliente ID debe ser un número válido'),
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre de la mascota es requerido')
        .isLength({ min: 1 })
        .withMessage('El nombre debe contener al menos 1 carácter'),
    body('especie')
        .optional()
        .trim(),
    body('raza')
        .optional()
        .trim(),
    body('fecha_nacimiento')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha inválido (use YYYY-MM-DD)'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

// para consulta
export const validarConsulta = [
    body('mascota_id')
        .isInt({ gt: 0 })
        .withMessage('Mascota ID debe ser un número válido'),
    body('motivo')
        .trim()
        .notEmpty()
        .withMessage('El motivo de la consulta es requerido')
        .isLength({ min: 5 })
        .withMessage('El motivo debe tener al menos 5 caracteres'),
    body('diagnostico')
        .optional()
        .trim(),
    body('tratamiento')
        .optional()
        .trim(),
    body('fecha_consulta')
        .optional()
        .isISO8601()
        .withMessage('Formato de fecha inválido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];

// para actualizar consulta 
export const validarActualizacionConsulta = [
    body('diagnostico')
        .optional()
        .trim(),
    body('tratamiento')
        .optional()
        .trim(),
    body('motivo')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('El motivo debe tener al menos 5 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }
        next();
    }
];