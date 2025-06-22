<img src="public/assets/logo-check-inn.png" height="100" alt="checkinn logo">



Plataforma web integral diseñada para la gestión completa de alojamientos turísticos. CheckInn facilita la conexión entre huéspedes, propietarios de alojamientos y administradores del sistema, proporcionando herramientas especializadas para cada tipo de usuario.

## 🌟 Características Principales

- **Búsqueda avanzada** de alojamientos con filtros personalizables
- **Sistema de reservas** en tiempo real
- **Gestión integral** de propiedades para propietarios
- **Panel de administración** centralizado
- **Interfaz intuitiva** y completamente responsiva

## 👥 Tipos de Usuario

### 🧳 Huésped
- Búsqueda y reserva de alojamientos
- Gestión de perfil personal
- Historial de reservas
- Sistema de valoraciones y comentarios

### 🏠 Propietario de Alojamiento
- Publicación y administración de propiedades
- Control de disponibilidad y precios
- Gestión de reservas entrantes
- Comunicación directa con huéspedes

### ⚙️ Administrador del Sistema
- Supervisión completa de la plataforma
- Gestión de usuarios y contenido
- Moderación y reportes
- Análisis y estadísticas

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modulares organizados
- **JavaScript Vanilla** - Lógica de cliente sin frameworks
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía (familia Inter)

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web para API REST
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **bcrypt** - Hashing seguro de contraseñas

## 📋 Requisitos Previos

- Node.js versión 18.x o superior
- MySQL Server 8.0 o superior
- npm o yarn como gestor de paquetes

## 🚀 Instalación

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/smamby/pigh.git
cd PIGH
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=check_inn_db

# Configuración del Servidor
PORT=3001
NODE_ENV=development

# Claves de Seguridad
JWT_SECRET=tu_clave_secreta_jwt
BCRYPT_ROUNDS=12

# Configuración de Email (opcional)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_app
```

### Paso 4: Configurar la base de datos MySQL
```sql
-- Crear base de datos
CREATE DATABASE check_inn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico (opcional pero recomendado)
CREATE USER 'check_inn_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON check_inn_db.* TO 'check_inn_user'@'localhost';
FLUSH PRIVILEGES;
```

### Paso 5: Inicializar el servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📁 Estructura del Proyecto

```
PIGH-ALOJAMIENTOV2/
├── controllers/          # Lógica de controladores
├── middleware/           # Middleware personalizado
├── models/              # Modelos de datos
├── public/              # Archivos estáticos
├── routes/              # Definición de rutas
├── schema/              # Esquemas de base de datos
├── .env                 # Variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── db.js               # Configuración de base de datos
├── index.js            # Punto de entrada de la aplicación
├── package.json        # Configuración del proyecto
├── README.md           # Documentación del proyecto
└── routes.js           # Configuración de rutas principales
```

## 🔧 Dependencias Principales

### Producción
- `express` - Framework web
- `mysql2` - Driver MySQL para Node.js
- `cors` - Manejo de CORS
- `body-parser` - Procesamiento de request bodies
- `dotenv` - Gestión de variables de entorno
- `bcrypt` - Hashing seguro de contraseñas
- `jsonwebtoken` - Implementación de JWT

### Desarrollo
- `nodemon` - Reinicio automático del servidor

## ✅ Verificación de la Instalación

1. Acceder a `http://localhost:3001`
2. Verificar la conexión a la base de datos MySQL
3. Comprobar la carga correcta de archivos estáticos
4. Realizar pruebas básicas de funcionalidad

## 🚀 Despliegue en Producción

### Consideraciones de Despliegue
- **Servidor web**: Nginx o Apache para servir archivos estáticos
- **Gestor de procesos**: PM2 para el backend Node.js
- **Base de datos**: MySQL en servidor dedicado o servicio en la nube
- **SSL/TLS**: Implementación de certificados para HTTPS

### Configuración de Seguridad
- Cambiar todas las claves y secretos por valores seguros
- Implementar rate limiting
- Configurar headers de seguridad
- Establecer validación robusta de inputs
- Implementar logs de auditoría

### Monitoreo y Mantenimiento
- Configurar logs estructurados
- Implementar métricas de rendimiento
- Establecer alertas de sistema
- Programar backups regulares de la base de datos

## 📖 Documentación de Uso

### Para Huéspedes
1. **Registro**: Crear cuenta con validación por email
2. **Búsqueda**: Utilizar filtros por destino, fechas y capacidad
3. **Reserva**: Seleccionar alojamiento y confirmar reserva
4. **Gestión**: Administrar reservas desde "Mis Reservas"

### Para Propietarios
1. **Registro de propiedad**: Acceder a "Registra tu alojamiento"
2. **Configuración**: Completar información, fotos y servicios
3. **Gestión**: Administrar disponibilidad y precios
4. **Comunicación**: Interactuar con huéspedes

### Para Administradores
- Gestión integral de usuarios registrados
- Proceso de aprobación/rechazo de alojamientos
- Supervisión y modificación de reservas
- Moderación de comentarios y reportes
- Generación de reportes y estadísticas

## 🆘 Soporte y Asistencia

- **Sección Help** en la plataforma
- **Contacto directo** con administradores
- **Sistema de tickets** integrado
- **Documentación técnica** completa disponible

## 🤝 Contribuir

Para contribuir a este proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request



## ✨ Recursos Adicionales

- Documentación de endpoints API
- Guías de troubleshooting
- Procedimientos de backup y recovery
- Políticas de actualización y mantenimiento

---

**CheckInn** - Conectando huéspedes con alojamientos excepcionales 🌟
