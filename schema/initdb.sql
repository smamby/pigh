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

ALTER TABLE `alojamientos` DROP COLUMN `precio`;
    
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


ALTER TABLE `tipo_habitacion` 
ADD COLUMN `politica_cancelacion` ENUM('flexible', 'moderada', 'estricta', 'temp_alta', 'temp_baja') DEFAULT 'moderada',
ADD COLUMN `incluye_desayuno` BOOLEAN DEFAULT FALSE,
ADD COLUMN `horario_checkin` TIME DEFAULT '15:00:00',
ADD COLUMN `horario_checkout` TIME DEFAULT '11:00:00';

-- politicas de cancelacion, no sera mejor en una tabla a parte, y que cada alojamiento diseñe las suyas?

-- create table politicas_cancelacion
-- id_politica INT AUTO INCREMENT,
-- costo DECIMAL(10,2) NOT NULL,
-- limite_dias INT,
-- id_alojamiento INT,
-- id_tipo_habitacion INT,
-- FOREIGN KEYS AND CONSTRAINT

CREATE TABLE IF NOT EXISTS `precios_habitacion` (
  `id_precio` INT NOT NULL AUTO_INCREMENT,
  `id_tipo_habitacion` INT NOT NULL,
  `fecha_inicio` DATE NOT NULL,  -- Desde cuándo aplica el precio
  `fecha_fin` DATE NULL,         -- Hasta cuándo (NULL = precio indefinido)
  `precio_noche` DECIMAL(10, 2) NOT NULL,
  `moneda` VARCHAR(3) DEFAULT 'USD',
  `es_promo` BOOLEAN DEFAULT FALSE, -- ¿Es una promoción?
  `notas` TEXT NULL,
  PRIMARY KEY (`id_precio`),
  INDEX `idx_tipo_fechas` (`id_tipo_habitacion`, `fecha_inicio`, `fecha_fin`),
  CONSTRAINT `fk_precio_tipo_habitacion`
    FOREIGN KEY (`id_tipo_habitacion`)
    REFERENCES `tipo_habitacion` (`id_tipo_habitacion`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



select * from tipo_habitacion;

CREATE TABLE IF NOT EXISTS `caracteristicas_habitacion` (
  `id_caracteristica` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,  -- Ej: "WiFi Gratis", "Aire Acondicionado"
  `icono` VARCHAR(50) NULL,               -- Opcional: Para mostrar un icono (ej: "wifi", "snowflake")
  `descripcion` TEXT NULL,                -- Detalles adicionales
  `es_prioritario` BOOLEAN DEFAULT FALSE, -- Si aparece destacado en listados
  PRIMARY KEY (`id_caracteristica`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    REFERENCES `caracteristicas_habitacion` (`id_caracteristica`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


select * from habitacion_tipo_caracteristica;
select * from habitaciones;
select * from tipo_habitacion;
select * from habitacion_carcteristicas;
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
  `estado` ENUM('habilitada', 'mantenimiento', 'clausurada') NOT NULL DEFAULT 'libre',
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
where id_alojamiento = 23;


UPDATE habitaciones
SET precio = 190
WHERE id_habitacion = 127;

UPDATE habitaciones
SET notas = CONCAT(notas, ', cama queen size más una cama individual')
WHERE id_habitacion = 81;

INSERT INTO `habitaciones` (
  `numero_habitacion`, `id_tipo_habitacion`, `plazas`, `precio`, 
  `estado`, `id_alojamiento`, `notas`
) VALUES (
  'SB355', 3, 2, 280.00, 
  'habilitada', 23, 'Sala de trabajo independiente, minibar premium'
);
select * from tipo_habitacion where nombre = 'suite ejecutiva';

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
    
select * from habitaciones where id_alojamiento = 23;
select count(*) from habitaciones h
        WHERE id_alojamiento = 23
        AND h.id_tipo_habitacion = 2;

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_habitacion INT NOT NULL,
    id_alojamiento INT NOT NULL,
    checkin DATE NOT NULL,
    checkout DATE NOT NULL,
    adultos INT NOT NULL DEFAULT 1,
    menores INT NOT NULL DEFAULT 0,
    estado ENUM ('pausada','activa','pendiente', 'reservada','pagada','cancelada','caduca') NOT NULL DEFAULT 'pendiente',
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE CASCADE,
    FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id_alojamiento) ON DELETE CASCADE,
    
    CONSTRAINT chk_fechas CHECK (fecha_fin > fecha_inicio)
);

ALTER TABLE reservas
DROP COLUMN precio_total;
 
SHOW COLUMNS FROM reservas;
select * from reservas;

select * from reservas where id_alojamiento = 23;

SELECT r.*, a.nombre_aloj AS nombre_alojamiento, a.ciudad, a.pais, h.numero_habitacion, th.nombre
FROM reservas r
JOIN alojamientos a ON r.id_alojamiento = a.id_alojamiento
JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
JOIN tipo_habitacion th ON th.id_tipo_habitacion = h.id_tipo_habitacion
WHERE r.id_usuario = 6
ORDER BY r.checkin DESC;

SELECT r.*, a.nombre_aloj AS nombre_alojamiento, a.ciudad, a.pais, h.numero_habitacion, th.nombre, u.nombre, u.apellido, u.email
FROM reservas r
JOIN alojamientos a ON r.id_alojamiento = a.id_alojamiento
JOIN usuarios u ON r.id_usuario = u.id_usuario
JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
JOIN tipo_habitacion th ON th.id_tipo_habitacion = h.id_tipo_habitacion
WHERE a.id_alojamiento = 23
ORDER BY r.checkin DESC;

UPDATE reservas
set habitaciones = 1;

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