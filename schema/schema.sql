-- database/schema.sql

-- Eliminar las tablas si ya existen (útil para desarrollo)
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS alojamientos;
DROP TABLE IF EXISTS usuarios;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Se almacenará el hash de la contraseña
    es_admin BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Alojamientos
CREATE TABLE alojamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Argentina', -- Enfocado en Argentina y Latam
    precio_por_noche DECIMAL(10, 2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    tipo_alojamiento VARCHAR(50), -- Ej: Hotel, Departamento, Cabaña
    capacidad INT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    usuario_id INT, -- Quién puede administrar este alojamiento (opcional, para un superadmin o si un usuario puede listar sus props)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL -- Si se borra el usuario, el alojamiento queda sin admin asignado
);

-- Tabla de Reservas
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    alojamiento_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Ej: Pendiente, Confirmada, Cancelada
    precio_total DECIMAL(10, 2) NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE, -- Si se borra el usuario, se borran sus reservas
    FOREIGN KEY (alojamiento_id) REFERENCES alojamientos(id) ON DELETE CASCADE, -- Si se borra el alojamiento, se borran sus reservas
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio) -- Asegurar que la fecha de fin sea posterior o igual a la de inicio
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_alojamiento_ciudad ON alojamientos(ciudad);
CREATE INDEX idx_alojamiento_pais ON alojamientos(pais);
CREATE INDEX idx_alojamiento_tipo ON alojamientos(tipo_alojamiento);
CREATE INDEX idx_reserva_usuario ON reservas(usuario_id);
CREATE INDEX idx_reserva_alojamiento ON reservas(alojamiento_id);

-- Insertar un usuario administrador por defecto (opcional)
INSERT INTO usuarios (nombre, apellido, email, password, es_admin) VALUES
('Admin', 'Principal', 'admin@example.com', 'admin123', TRUE); -- IMPORTANTE: La contraseña debe ser hasheada en la aplicación real

-- Insertar algunos países y ciudades de ejemplo para alojamientos (Latinoamérica)
-- (Estos son solo ejemplos, se pueden agregar más según sea necesario)

-- Insertar ejemplos de alojamientos (opcional)
INSERT INTO alojamientos (nombre, descripcion, direccion, ciudad, pais, precio_por_noche, tipo_alojamiento, capacidad) VALUES
('Hotel Cordillera', 'Un hotel acogedor en el corazón de Mendoza.', 'Av. San Martín 123', 'Mendoza', 'Argentina', 7500.00, 'Hotel', 2),
('Departamento Sol y Playa', 'Departamento con vista al mar en Mar del Plata.', 'Bv. Marítimo P. Peralta Ramos 456', 'Mar del Plata', 'Argentina', 12000.00, 'Departamento', 4),
('Cabañas del Bosque', 'Tranquilas cabañas en Bariloche.', 'Ruta 40 Km 25', 'Bariloche', 'Argentina', 15000.00, 'Cabaña', 5),
('Hostal del Viajero Lima', 'Económico y céntrico hostal en Lima.', 'Jr. de la Unión 789', 'Lima', 'Perú', 30.00, 'Hostal', 1),
('Posada Colonial Cartagena', 'Encantadora posada en la ciudad amurallada.', 'Calle de la Iglesia 10', 'Cartagena', 'Colombia', 90.00, 'Posada', 2);