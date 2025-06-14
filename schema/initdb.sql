show databases;
create database if not exists pighdb;

use pighdb;

CREATE TABLE IF NOT EXISTS `tipo_alojamiento` (
  `id_tipo_alojamiento` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'Hotel', 'Resort', 'Casa de Huéspedes', 'ApartHotel'
  `descripcion` TEXT NULL,
  PRIMARY KEY (`id_tipo_alojamiento`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert common accommodation types
INSERT INTO `tipo_alojamiento` (`nombre`, `descripcion`) VALUES
('Hotel', 'Establecimiento que ofrece alojamiento y servicios relacionados.'),
('Resort', 'Gran complejo turístico con múltiples instalaciones y servicios.'),
('Casa de Huéspedes', 'Alojamiento más pequeño y personal, a menudo operado por los propietarios.'),
('ApartHotel', 'Apartamentos amueblados con servicios de hotel.'),
('Hostel', 'Alojamiento económico con habitaciones compartidas y áreas comunes.'),
('Cabaña', 'Vivienda rústica, a menudo en entornos naturales.');

select * from tipo_alojamiento;

CREATE TABLE IF NOT EXISTS `alojamiento_imagenes` (
  `id_imagen` INT NOT NULL AUTO_INCREMENT,
  `id_alojamiento` INT NOT NULL,
  `url_imagen` VARCHAR(500) NOT NULL,
  `es_principal` BOOLEAN NOT NULL DEFAULT FALSE, -- To mark one image as the main one
  `orden` INT NULL, -- For display order
  PRIMARY KEY (`id_imagen`),
  INDEX `fk_alojamiento_imagen_alojamiento_idx` (`id_alojamiento` ASC) VISIBLE,
  CONSTRAINT `fk_alojamiento_imagen_alojamiento`
    FOREIGN KEY (`id_alojamiento`)
    REFERENCES `alojamiento` (`id_alojamiento`)
    ON DELETE CASCADE -- Delete images if accommodation is deleted
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

select * from alojamiento_imagenes;

-- -----------------------------------------------------
-- Table `caracteristica`
-- General features/amenities (e.g., 'Wifi', 'Piscina', 'Desayuno', 'Gimnasio')
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `caracteristica` (
  `id_caracteristica` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `icono` VARCHAR(50) NULL, -- Optional: store an icon class or name (e.g., 'fa-wifi')
  `descripcion` TEXT NULL,
  PRIMARY KEY (`id_caracteristica`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some common features
INSERT INTO `caracteristica` (`nombre`, `icono`) VALUES
('Wi-Fi Gratuito', 'fa-wifi'),
('Piscina', 'fa-swimming-pool'),
('Desayuno Incluido', 'fa-coffee'),
('Estacionamiento', 'fa-parking'),
('Gimnasio', 'fa-dumbbell'),
('Restaurante', 'fa-utensils'),
('Servicio a la Habitación', 'fa-bell-concierge'),
('Aire Acondicionado', 'fa-snowflake'),
('Calefacción', 'fa-fire'),
('TV por Cable', 'fa-tv');

select * from caracteristica;

-- Many-to-many relationship between accommodations and features
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `alojamiento_caracteristica` (
  `id_alojamiento` INT NOT NULL,
  `id_caracteristica` INT NOT NULL,
  PRIMARY KEY (`id_alojamiento`, `id_caracteristica`),
  INDEX `fk_alojamiento_caracteristica_caracteristica_idx` (`id_caracteristica` ASC) VISIBLE,
  CONSTRAINT `fk_alojamiento_caracteristica_alojamiento`
    FOREIGN KEY (`id_alojamiento`)
    REFERENCES `alojamientos` (`id_alojamiento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alojamiento_caracteristica_caracteristica`
    FOREIGN KEY (`id_caracteristica`)
    REFERENCES `caracteristica` (`id_caracteristica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

select count(*) from alojamiento_caracteristica;

SET SQL_SAFE_UPDATES = 0;
delete from alojamiento_caracteristica;
ALTER TABLE alojamiento_caracteristica AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `alojamientos` (
  `id_alojamiento` INT NOT NULL AUTO_INCREMENT, -- Clave primaria de este alojamiento
  `nombre_aloj` VARCHAR(255) NOT NULL,
  `id_tipo_alojamiento` INT NOT NULL, -- Clave foránea a tipo_alojamiento
  `descripcion` TEXT NULL, -- Añadido de la segunda definición
  `capacidad` INT NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `pais` VARCHAR(100) NOT NULL,
  `estrellas` TINYINT UNSIGNED NULL,
  `promedio_puntaje` DECIMAL(2,1)  DEFAULT 6,
  `cantidad_puntajes` INT UNSIGNED DEFAULT 1,
  `latitud` DECIMAL(10, 8) NULL,
  `longitud` DECIMAL(11, 8) NULL,
  `telefono` VARCHAR(50) NULL,
  `email` VARCHAR(255) NULL,
  `check_in_hora` TIME NULL,
  `check_out_hora` TIME NULL,
  `politicas` TEXT NULL,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE, -- Representa la disponibilidad
  -- `capacidad` de la segunda tabla es mejor manejarla por el inventario de habitaciones o reservas
  -- `precio` en la segunda tabla es mejor manejarlo por `habitacion_inventario` o tarifas
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_alojamiento`),
  INDEX `fk_alojamiento_tipo_alojamiento_idx` (`id_tipo_alojamiento` ASC) VISIBLE,
  CONSTRAINT `fk_alojamiento_tipo_alojamiento`
    FOREIGN KEY (`id_tipo_alojamiento`)
    REFERENCES `tipo_alojamiento` (`id_tipo_alojamiento`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  -- Índices adicionales de la segunda definición de alojamientos
  INDEX `idx_ciudad` (ciudad),
  INDEX `idx_pais` (pais),
  -- No hay un índice directo para 'tipo' porque ahora es una FK a `id_tipo_alojamiento`
  INDEX `idx_estrellas` (estrellas),
  -- No hay un índice directo para 'precio' en la tabla de alojamiento principal
  INDEX `idx_activo` (`activo`), -- Usamos 'activo' en lugar de 'disponibilidad'
  INDEX `idx_ubicacion` (latitud, longitud)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


    
ALTER TABLE alojamientos
ADD COLUMN promedio_puntaje DECIMAL(2,1) DEFAULT 6,
ADD COLUMN cantidad_puntajes INT UNSIGNED DEFAULT 1;


select count(*) from alojamientos;
select * from alojamientos;
select promedio_puntaje from alojamientos;

#delete from alojamientos where id_alojamiento > 0;
DELETE FROM alojamientos;
ALTER TABLE alojamientos AUTO_INCREMENT = 1;


select distinct ciudad from alojamientos;

SELECT DISTINCT ciudad FROM alojamientos WHERE LOWER(ciudad) LIKE LOWER('%san%') LIMIT 5;

-- Actualizar puntajes y cantidad de puntajes por estrellas
UPDATE alojamientos
SET 
    promedio_puntaje = ROUND(5 + (RAND() * (1 + estrellas) * 0.9), 2),
    cantidad_puntajes = FLOOR(10 * POW(estrellas, 1.5) + RAND() * 50);

UPDATE alojamientos
SET promedio_puntaje = ROUND(promedio_puntaje, 1);


SET SQL_SAFE_UPDATES = 0;

CREATE TABLE IF NOT EXISTS `tipo_habitacion` (
  `id_tipo_habitacion` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Standard Double', 'Deluxe King', 'Suite', 'Familia'
  `descripcion` TEXT NULL,
  `capacidad_adultos` TINYINT NOT NULL DEFAULT 1,
  `capacidad_menores` TINYINT NOT NULL DEFAULT 0,
  `tamanio_m2` DECIMAL(6,2) NULL, -- Size in square meters
  `camas_detalle` VARCHAR(255) NULL, -- e.g., '1 Cama King', '2 Camas Dobles'
  `precio_base` DECIMAL(10, 2) NOT NULL, -- Base price per night for this room type
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id_tipo_habitacion`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some common room types
INSERT INTO `tipo_habitacion` (`nombre`, `descripcion`, `capacidad_adultos`, `capacidad_menores`, `precio_base`) VALUES
('Habitación Estándar Doble', 'Una habitación cómoda con dos camas individuales o una doble.', 2, 0, 80.00),
('Habitación Deluxe King', 'Habitación espaciosa con una cama king-size y vista panorámica.', 2, 1, 120.00),
('Suite Ejecutiva', 'Suite de lujo con sala de estar separada y comodidades premium.', 2, 2, 250.00),
('Habitación Familiar', 'Ideal para familias, con espacio para hasta 4 personas.', 2, 2, 150.00);

INSERT INTO `tipo_habitacion` (`nombre`, `descripcion`, `capacidad_adultos`, `capacidad_menores`, `tamanio_m2`, `camas_detalle`, `precio_base`) VALUES
('Habitación Superior con Terraza', 'Habitación amplia con terraza privada y vistas a la ciudad.', 2, 1, 28.50, '1 Cama King Size', 180.00),
('Suite Nupcial', 'Suite romántica con jacuzzi, decoración premium y detalles especiales.', 2, 0, 45.00, '1 Cama King Size con dosel', 350.00),
('Habitación Triple', 'Habitación con tres camas individuales, ideal para grupos.', 3, 0, 24.00, '3 Camas Individuales', 110.00),
('Suite Familiar Deluxe', 'Amplia suite con dos habitaciones separadas y baño compartido.', 4, 2, 60.00, '1 Cama King + 2 Camas Individuales', 280.00),
('Habitación Accesible', 'Habitación adaptada para personas con movilidad reducida.', 2, 0, 30.00, '1 Cama Queen Size', 90.00),
('Habitación Económica Individual', 'Habitación compacta con todas las comodidades básicas.', 1, 0, 12.00, '1 Cama Individual', 50.00),
('Suite Presidencial', 'La máxima categoría del hotel con servicios exclusivos.', 2, 0, 120.00, '1 Cama King Size de lujo', 800.00),
('Habitación con Jacuzzi', 'Habitación con jacuzzi privado en la habitación.', 2, 0, 35.00, '1 Cama King Size', 300.00),
('Habitación Connecting', 'Dos habitaciones estándar conectadas por puerta interior.', 4, 2, 40.00, '2 Camas Dobles en cada habitación', 220.00),
('Dormitorio Colectivo', 'Opción económica con camas en dormitorio compartido.', 6, 0, 25.00, '6 Camas Individuales', 30.00);

select count(*) from tipo_habitacion;
-- -----------------------------------------------------
-- Table `habitacion_tipo_caracteristica`
-- Many-to-many relationship between room types and features
-- (e.g., 'Baño Privado', 'Balcón', 'Minibar')
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `habitacion_tipo_caracteristica` (
  `id_tipo_habitacion` INT NOT NULL,
  `id_caracteristica` INT NOT NULL,
  PRIMARY KEY (`id_tipo_habitacion`, `id_caracteristica`),
  INDEX `fk_habitacion_tipo_caracteristica_caracteristica_idx` (`id_caracteristica` ASC) VISIBLE,
  CONSTRAINT `fk_habitacion_tipo_caracteristica_tipo_habitacion`
    FOREIGN KEY (`id_tipo_habitacion`)
    REFERENCES `tipo_habitacion` (`id_tipo_habitacion`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_habitacion_tipo_caracteristica_caracteristica`
    FOREIGN KEY (`id_caracteristica`)
    REFERENCES `caracteristica` (`id_caracteristica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

select * from habitacion_tipo_caracteristica;
-- -----------------------------------------------------
-- Table `habitacion_inventario`
-- Tracks the number of available rooms of a specific `tipo_habitacion`
-- at a particular `alojamiento`. This is the core of room availability.
-- `num_habitacion_fisica` could be added here if you want to track individual physical room numbers.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `habitacion_inventario` (
  `id_inventario` INT NOT NULL AUTO_INCREMENT,
  `id_alojamiento` INT NOT NULL,
  `id_tipo_habitacion` INT NOT NULL,
  `cantidad_total` SMALLINT UNSIGNED NOT NULL, -- Total rooms of this type in this accommodation
  -- This table represents the *type* of room available at an accommodation.
  -- Actual availability for booking would require a separate `reservas` table
  -- and date-based logic to calculate what's free.
  PRIMARY KEY (`id_inventario`),
  UNIQUE INDEX `uq_alojamiento_tipo_habitacion` (`id_alojamiento`, `id_tipo_habitacion`), -- One entry per type per accommodation
  INDEX `fk_habitacion_inventario_tipo_habitacion_idx` (`id_tipo_habitacion` ASC) VISIBLE,
  CONSTRAINT `fk_habitacion_inventario_alojamiento`
    FOREIGN KEY (`id_alojamiento`)
    REFERENCES `alojamiento` (`id_alojamiento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_habitacion_inventario_tipo_habitacion`
    FOREIGN KEY (`id_tipo_habitacion`)
    REFERENCES `tipo_habitacion` (`id_tipo_habitacion`)
    ON DELETE RESTRICT -- Don't delete a room type if it's used in inventory
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `habitacion_imagen`
-- Stores URLs or paths to images for each room type
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `habitacion_imagen` (
  `id_imagen` INT NOT NULL AUTO_INCREMENT,
  `id_tipo_habitacion` INT NOT NULL,
  `url_imagen` VARCHAR(500) NOT NULL,
  `es_principal` BOOLEAN NOT NULL DEFAULT FALSE,
  `orden` INT NULL,
  PRIMARY KEY (`id_imagen`),
  INDEX `fk_habitacion_imagen_tipo_habitacion_idx` (`id_tipo_habitacion` ASC) VISIBLE,
  CONSTRAINT `fk_habitacion_imagen_tipo_habitacion`
    FOREIGN KEY (`id_tipo_habitacion`)
    REFERENCES `tipo_habitacion` (`id_tipo_habitacion`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `habitaciones` (
  `id_habitacion` INT NOT NULL AUTO_INCREMENT, 
  `numero_habitacion` VARCHAR(15) NOT NULL,
  `id_tipo_habitacion` INT NOT NULL,    
  `plazas` INT NOT NULL CHECK (plazas > 0),
  `precio` decimal (10,2),
  `estado` ENUM('libre', 'ocupada', 'reservada', 'deshabilitada', 'mantenimiento', 'limpieza') NOT NULL DEFAULT 'libre',
  `id_alojamiento` INT NOT NULL,     
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  `notas` TEXT NULL,                           
  PRIMARY KEY (`id_habitacion`),
  UNIQUE INDEX `uq_numero_habitacion_alojamiento` (`numero_habitacion`, `id_alojamiento`), -- Asegura que el número de habitación sea único por cada alojamiento
  INDEX `idx_estado` (`estado`),                 -- Índice para búsquedas rápidas por estado
  INDEX `idx_tipo_habitacion` (`id_tipo_habitacion`), -- Índice para la clave foránea del tipo de habitación
  INDEX `fk_habitaciones_alojamiento_idx` (`id_alojamiento` ASC) VISIBLE, -- Índice para la clave foránea del alojamiento

  -- Restricciones (Constraints)
  CONSTRAINT `fk_habitaciones_alojamiento`
    FOREIGN KEY (`id_alojamiento`)
    REFERENCES `alojamientos` (`id_alojamiento`)
    ON DELETE CASCADE  -- Si se elimina un alojamiento, se eliminan sus habitaciones físicas
    ON UPDATE CASCADE, -- Si el ID de un alojamiento cambia, se actualiza en las habitaciones

  CONSTRAINT `fk_habitaciones_tipo_habitacion`
    FOREIGN KEY (`id_tipo_habitacion`)
    REFERENCES `tipo_habitacion` (`id_tipo_habitacion`)
    ON DELETE RESTRICT -- No permite eliminar un tipo de habitación si hay habitaciones físicas asociadas
    ON UPDATE CASCADE  -- Si el ID de un tipo de habitación cambia, se actualiza en las habitaciones
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE habitaciones
ADD COLUMN plazas INT CHECK (plazas > 0);

ALTER TABLE habitaciones
MODIFY COLUMN plazas INT NOT NULL CHECK (plazas > 0);

ALTER TABLE habitaciones
ADD COLUMN precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00;


UPDATE habitaciones
SET estado = 'habilitada';

UPDATE habitaciones
SET plazas = 2;

ALTER TABLE habitaciones
MODIFY COLUMN estado ENUM('habilitada', 'mantenimiento', 'clausurada') NOT NULL DEFAULT 'habilitada';


SET SQL_SAFE_UPDATES = 1;

UPDATE habitaciones
SET plazas = 2;

SET SQL_SAFE_UPDATES = 0;

select * from habitaciones
where id_alojamiento = 1;

INSERT INTO habitaciones (numero_habitacion, id_tipo_habitacion, plazas, estado, id_alojamiento) VALUES (
  '103B', 1, 3, 'habilitada', 1
);

UPDATE habitaciones
SET notas = 'Vista al parque'
WHERE id_habitacion = 81;

UPDATE habitaciones
SET notas = CONCAT(notas, ', cama queen size más una cama individual')
WHERE id_habitacion = 81;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY ,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Se almacenará el hash de la contraseña
    es_admin BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, apellido, email, password, es_admin) VALUES
('admin', 'Principal', 'admin@email.com', 'admini', TRUE),
('Juan', 'Perez', 'juan@email.com', '123123', FALSE);

CREATE TABLE avatares (
    id_avatar INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    imagen_bitmap LONGBLOB NOT NULL,
    ancho INT NOT NULL COMMENT 'Ancho de la imagen en píxeles',
    alto INT NOT NULL COMMENT 'Alto de la imagen en píxeles',
    formato VARCHAR(10) NOT NULL COMMENT 'Formato de imagen (ej. BMP, PNG, JPEG)',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,    
    INDEX (id_usuario) COMMENT 'Índice para búsquedas por usuario'
);
    
CREATE TABLE mensaje (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    id_alojamiento INT NOT NULL UNIQUE,
    mensaje VARCHAR(265) NOT NULL,
    calificacion TINYINT UNSIGNED, -- Por ejemplo, de 1 a 5 estrellas
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    es_publico BOOLEAN DEFAULT TRUE, -- Para moderar visibilidad si es necesario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id_alojamiento) ON DELETE CASCADE
);
select id_habitacion from habitaciones where id_alojamiento = 21 or id_alojamiento = 22 or id_alojamiento = 23;

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_habitacion INT NOT NULL,
    id_alojamiento INT NOT NULL,
    checkin DATE NOT NULL,
    checkout DATE NOT NULL,
    adultos INT NOT NULL DEFAULT 1,
    menores INT NOT NULL DEFAULT 0,
    habitaciones INT NOT NULL DEFAULT 1,
    estado ENUM ('pausada','activa','pendiente', 'reservada','pagada','cancelada','caduca') NOT NULL DEFAULT 'pendiente',
    precio_total DECIMAL(10, 2) NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE CASCADE,
    FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id_alojamiento) ON DELETE CASCADE,
    
    CONSTRAINT chk_fechas CHECK (fecha_fin > fecha_inicio)
);
 

select * from reservas;

CREATE INDEX idx_reservas_habitacion_fechas ON reservas(id_habitacion, checkin, checkout);
CREATE INDEX idx_habitaciones_alojamiento_tipo ON habitaciones(id_alojamiento, id_tipo_habitacion);
SHOW INDEX FROM reservas;
SHOW INDEX FROM habitaciones;


select * from usuarios;


CREATE TABLE IF NOT EXISTS puntaje (
  id_puntaje INT NOT NULL AUTO_INCREMENT,
  id_alojamiento INT NOT NULL,
  puntuacion DECIMAL(2,1) NOT NULL CHECK (puntuacion >= 5.0 AND puntuacion <= 9.9),
  comentario TEXT,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT,
  publicado BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_puntaje),
  INDEX idx_alojamiento (id_alojamiento),
  CONSTRAINT fk_puntaje_alojamiento
    FOREIGN KEY (id_alojamiento)
    REFERENCES alojamientos (id_alojamiento)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_puntaje_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


select * from puntaje;

SELECT
    id_alojamiento,
    nombre_aloj,
    promedio_puntaje,
    cantidad_puntajes
FROM
    alojamientos
WHERE
    id_alojamiento = 1;



-- Trigger para actualizar puntaje promedio y cantidad de puntajes de 
-- alojamiento al registrar un nuevo puntaje por parte del usuario

DELIMITER $$

CREATE TRIGGER tr_actualizar_promedio_puntaje
AFTER INSERT ON puntaje
FOR EACH ROW
BEGIN
  UPDATE alojamientos
  SET 
    cantidad_puntajes = cantidad_puntajes + 1,
    promedio_puntaje = ROUND(((promedio_puntaje * (cantidad_puntajes)) + NEW.puntuacion) / (cantidad_puntajes + 1), 2)
  WHERE id_alojamiento = NEW.id_alojamiento;
END $$

DELIMITER ;