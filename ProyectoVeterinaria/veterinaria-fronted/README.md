# Frontend - Gestión de Veterinaria

Este es el frontend de la aplicación de gestión de veterinaria, desarrollado en React con Vite.

## Requisitos Previos

- Node.js v18 o superior
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── api/
│   └── apiClient.js        # Cliente HTTP con axios
├── pages/
│   ├── Login.jsx           # Página de login con CAPTCHA
│   ├── Registro.jsx        # Página de registro con CAPTCHA
│   ├── DashboardAdmin.jsx  # Dashboard para administradores
│   ├── DashboardCliente.jsx # Dashboard para clientes
│   ├── Consultas.jsx       # Gestión de consultas
│   └── NuevaMascota.jsx    # Formulario de nueva mascota
├── components/
│   └── Menu.jsx            # Menú de navegación
├── styles/
│   ├── Auth.css            # Estilos de autenticación
│   ├── Menu.css            # Estilos del menú
│   ├── Dashboard.css       # Estilos del dashboard
│   ├── Consultas.css       # Estilos de consultas
│   ├── Forms.css           # Estilos de formularios
│   └── Global.css          # Estilos globales
├── App.jsx                 # Componente raíz
└── main.jsx                # Punto de entrada
```

## Características

### Para Clientes
- **Registro y Login** con CAPTCHA
- **Validación de Contraseña** (Débil, Intermedio, Fuerte)
- **Dashboard** con información personal
- **Gestión de Mascotas** (Crear, Ver, Editar, Eliminar)
- **Historial de Consultas** por mascota
- **Descargar Reportes PDF** de consultas

### Para Administradores
- **Dashboard Administrativo**
- **Visualizar todas las Consultas**
- **Gestión de Clientes**
- **Gestión General del Sistema**

## Flujo de Autenticación

1. El usuario accede a `/login` o `/registro`
2. Se genera un CAPTCHA en la pantalla
3. El usuario completa el formulario con respuesta al CAPTCHA
4. Si es registro: Se valida contraseña (Débil/Intermedio/Fuerte)
5. Si todo es correcto: Se obtiene token JWT
6. Token se guarda en localStorage
7. Se redirige según el rol:
   - Admin → `/dashboard-admin`
   - Cliente → `/dashboard-cliente`

## Endpoints Utilizados

### Autenticación
- `POST /api/auth/registro` - Registro de usuario
- `POST /api/auth/login` - Login con CAPTCHA
- `GET /api/captcha/generar` - Generar CAPTCHA

### Clientes
- `GET /api/clientes/mi-perfil` - Obtener perfil del cliente
- `GET /api/clientes` - Listar todos los clientes (admin)
- `POST /api/clientes` - Crear cliente (admin)
- `PUT /api/clientes/:id` - Actualizar cliente (admin)
- `DELETE /api/clientes/:id` - Eliminar cliente (admin)

### Mascotas
- `GET /api/mascotas` - Listar mascotas
- `GET /api/mascotas/cliente/:clienteId` - Mascotas de un cliente
- `POST /api/mascotas` - Crear mascota
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota

### Consultas
- `GET /api/consultas` - Listar consultas
- `GET /api/consultas/mascota/:mascotaId` - Consultas de una mascota
- `POST /api/consultas` - Crear consulta
- `PUT /api/consultas/:id` - Actualizar consulta
- `DELETE /api/consultas/:id` - Eliminar consulta

### Reportes
- `GET /api/reportes/consulta/:consultaId` - Descargar PDF de consulta
- `GET /api/reportes/cliente/:clienteId` - Descargar PDF de cliente

## Variables de Entorno

El frontend se comunica con el backend en `http://localhost:3001`.

Para cambiar la URL del backend, modifica `src/api/apiClient.js`:

```javascript
const API_BASE_URL = 'http://localhost:3001/api'; // Cambia aquí
```

## Notas

- El CAPTCHA se genera en cada petición de login/registro
- El token JWT se almacena en localStorage y se envía en cada request
- Los estilos están completamente personalizados con CSS puro
- La aplicación es responsive y se adapta a dispositivos móviles

## Licencia

Proyecto académico - 2025
