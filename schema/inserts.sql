-- Alojamientos
INSERT INTO `alojamientos` (
    `nombre_aloj`, `id_tipo_alojamiento`, `descripcion`, `capacidad`, `precio`,
    `direccion`, `ciudad`, `pais`, `estrellas`, `latitud`, `longitud`,
    `telefono`, `email`, `check_in_hora`, `check_out_hora`, `politicas`, `activo`,
    `promedio_puntaje`, `cantidad_puntajes`
) VALUES
('Hotel Patios de Córdoba', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Encantador hotel en el centro histórico.', 50, 95, 'Calle San Fernando 12', 'Córdoba', 'España', 3, 37.88472700, -4.77915200, NULL, NULL, '14:00:00', '12:00:00', 'Check-in flexible disponible por un suplemento. No se permiten mascotas.', TRUE, 7.2, 1),
('Gran Hotel Córdoba Argentina', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Lujoso hotel con spa y casino.', 120, 150, 'Av. Hipólito Yrigoyen 1450', 'Córdoba', 'Argentina', 5, -31.42008300, -64.18877600, NULL, NULL, '15:00:00', '11:00:00', 'Se requiere depósito de garantía. Cancelación gratuita hasta 48 horas antes.', TRUE, 5.1, 1),
('Rosario Plaza Hotel', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Vistas al río Paraná.', 80, 110, 'Bv. Oroño 945', 'Rosario', 'Argentina', 4, -32.94312700, -60.65079500, NULL, NULL, '14:00:00', '10:30:00', 'Incluye desayuno buffet. Estacionamiento gratuito.', TRUE, 9.1, 1),
('Hotel Rosario Colombia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Cerca de la playa y centro comercial.', 45, 75, 'Calle 14 #5-23', 'Rosario', 'Colombia', 3, 5.82657800, -72.33678300, NULL, NULL, '13:00:00', '12:00:00', 'No fumadores. Se aceptan mascotas con cargo adicional.', TRUE, 6.8, 1),
('Hotel Valencia Palace', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'En el corazón de la ciudad de las artes.', 90, 130, 'Calle Paz 42', 'Valencia', 'España', 4, 39.46990700, -0.37628800, NULL, NULL, '16:00:00', '12:00:00', 'Spa incluido para huéspedes. Restaurante con estrella Michelin.', TRUE, 6.9, 1),
('Valencia Suites', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'ApartHotel'), 'Modernas suites cerca del centro.', 60, 85, 'Av. Bolívar Norte', 'Valencia', 'Venezuela', 4, 10.18065000, -67.99819000, NULL, NULL, '15:00:00', '11:00:00', 'Servicio a la habitación 24 horas. Wi-Fi gratuito.', TRUE, 5.6, 1),
('Hotel Lima Perú', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Frente al Océano Pacífico.', 100, 120, 'Malecón de la Reserva 615', 'Lima', 'Perú', 4, -12.11944000, -77.03418000, NULL, NULL, '14:00:00', '12:00:00', 'Piscina climatizada. Caja fuerte en habitación.', TRUE, 6.6, 1),
('Lima Inn Ohio', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Acogedor hotel en el medio oeste.', 30, 65, 'Main Street 234', 'Lima', 'Estados Unidos', 2, 40.74255000, -84.10527000, NULL, NULL, '15:00:00', '11:00:00', 'Desayuno continental incluido. Estacionamiento gratuito.', TRUE, 7.3, 1),
('Parador de Granada', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Histórico parador con vistas a la Alhambra.', 75, 180, 'Real de la Alhambra s/n', 'Granada', 'España', 5, 37.17648700, -3.58831500, NULL, NULL, '14:00:00', '12:00:00', 'Visitas guiadas al monumento. Restaurante con cocina tradicional.', TRUE, 6.3, 1),
('Granada Hotel Nicaragua', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Colonial hotel frente al lago.', 40, 70, 'Calle La Calzada 221', 'Granada', 'Nicaragua', 3, 11.92988000, -85.95618000, NULL, NULL, '13:00:00', '11:00:00', 'Terraza con vistas al lago. Excursiones disponibles.', TRUE, 8.4, 1),
('Hotel Medellín Colombia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'En el exclusivo barrio El Poblado.', 85, 90, 'Calle 10 #42-35', 'Medellín', 'Colombia', 4, 6.20876300, -75.57022000, NULL, NULL, '15:00:00', '12:00:00', 'Zona de fumadores designada. Gimnasio abierto 24 horas.', TRUE, 5.1, 1),
('Medellín Rural House', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Cabaña'), 'Casa rural en Extremadura.', 12, 55, 'Ctra. EX-203 km 12', 'Medellín', 'España', 3, 38.96285000, -5.95741000, NULL, NULL, '16:00:00', '11:00:00', 'Alquiler completo de la casa. Cocina totalmente equipada.', TRUE, 6.5, 1),
('Hotel Toledo España', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Antiguo convento restaurado.', 65, 115, 'Calle Hombre de Palo 7', 'Toledo', 'España', 4, 39.85705600, -4.02311300, NULL, NULL, '14:00:00', '12:00:00', 'No se permiten fiestas. Silencio después de las 22:00.', TRUE, 5.6, 1),
('Toledo Grand Hotel', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'En el centro de Ohio.', 50, 99, 'Madison Ave 444', 'Toledo', 'Estados Unidos', 3, 41.66393800, -83.55532200, NULL, NULL, '15:00:00', '11:00:00', 'Centro de negocios disponible. Servicio de lavandería.', TRUE, 7.3, 1),
('Hotel Málaga Palacio', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Frente al puerto deportivo.', 110, 125, 'Calle Cortina del Muelle 1', 'Málaga', 'España', 4, 36.71544700, -4.42013300, NULL, NULL, '14:00:00', '12:00:00', 'Playa privada disponible. Servicio de conserjería.', TRUE, 9.5, 1),
('Málaga Hostel Colombia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'Hostal económico cerca del centro.', 20, 25, 'Carrera 23 #15-20', 'Málaga', 'Colombia', 2, 6.69903000, -72.73131000, NULL, NULL, '13:00:00', '10:00:00', 'Habitaciones compartidas. Cocina comunitaria.', TRUE, 5.4, 1),
('Hotel Salamanca Plaza', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Junto a la Plaza Mayor.', 55, 105, 'Plaza del Corrillo 20', 'Salamanca', 'España', 3, 40.96496800, -5.66436900, NULL, NULL, '14:00:00', '12:00:00', 'Biblioteca con libros antiguos. Bar con tapas tradicionales.', TRUE, 7.4, 1),
('Salamanca Grand México', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Hotel de negocios en Guanajuato.', 70, 80, 'Blvd. López Mateos 1103', 'Salamanca', 'México', 4, 20.57196000, -101.19454000, NULL, NULL, '15:00:00', '13:00:00', 'Salas de reuniones disponibles. Servicio de transporte al aeropuerto.', TRUE, 6.4, 1),
('Hotel Burgos Centro', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Cerca de la catedral.', 40, 88, 'Calle Fernán González 72', 'Burgos', 'España', 3, 42.34004200, -3.69967600, NULL, NULL, '14:00:00', '12:00:00', 'Tours históricos incluidos. Vino de bienvenida.', TRUE, 8.1, 1),
('Burgos Hostel Colombia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'En el corazón del departamento de Norte de Santander.', 15, 30, 'Calle 5 #10-15', 'Burgos', 'Colombia', 1, 8.79052000, -73.17024000, NULL, NULL, '13:00:00', '10:00:00', 'Área de hamacas. Actividades grupales organizadas.', TRUE, 5.8, 1),
('Hotel Santa Cruz Tenerife', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Con vistas al océano Atlántico.', 95, 110, 'Calle San Felipe 12', 'Santa Cruz de Tenerife', 'España', 4, 28.46981000, -16.25485500, NULL, NULL, '14:00:00', '11:00:00', 'Piscina en la azotea. Bar con cócteles tropicales.', TRUE, 7.6, 1),
('Santa Cruz Inn Bolivia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Hotel económico en el centro.', 35, 45, 'Calle Sucre 345', 'Santa Cruz de la Sierra', 'Bolivia', 2, -17.78333000, -63.18213000, NULL, NULL, '12:00:00', '10:00:00', 'Ventiladores en todas las habitaciones. Agua purificada disponible.', TRUE, 7.3, 1),
('Santa Cruz Beach Hotel', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Resort'), 'Frente al mar en California.', 120, 160, 'Ocean Street 123', 'Santa Cruz', 'Estados Unidos', 4, 36.96400000, -122.02090000, NULL, NULL, '15:00:00', '11:00:00', 'Tablas de surf disponibles para alquilar. Fogatas en la playa.', TRUE, 8.2, 1),
('Hotel San José Costa Rica', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'En el distrito financiero.', 80, 95, 'Av. 3ra Calle Central', 'San José', 'Costa Rica', 4, 9.93254300, -84.07957800, NULL, NULL, '14:00:00', '12:00:00', 'Jardín tropical. Desayuno con frutas locales.', TRUE, 8.4, 1),
('San José Inn California', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Hotel boutique en Silicon Valley.', 45, 135, 'South 1st Street 540', 'San José', 'Estados Unidos', 3, 37.33478900, -121.88814000, NULL, NULL, '15:00:00', '11:00:00', 'Tecnología de punta en habitaciones. Conexión VPN para negocios.', TRUE, 8.4, 1),
('Hotel Palencia España', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Hotel moderno en Castilla y León.', 30, 75, 'Calle Mayor 45', 'Palencia', 'España', 3, 42.00955200, -4.52907500, NULL, NULL, '14:00:00', '12:00:00', 'Bicicletas gratuitas. Ruta de tapas recomendada.', TRUE, 5.5, 1),
('Palencia Suites México', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'ApartHotel'), 'Suites ejecutivas en Yucatán.', 25, 65, 'Calle 60 #345', 'Palencia', 'México', 3, 20.62349000, -89.14098000, NULL, NULL, '15:00:00', '11:00:00', 'Aire acondicionado en todas las áreas. Excursiones a cenotes.', TRUE, 6.1, 1),
('Hotel León España', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Junto a la catedral gótica.', 60, 100, 'Plaza de Regla 4', 'León', 'España', 4, 42.59872600, -5.56709600, NULL, NULL, '14:00:00', '12:00:00', 'Visitas guiadas a la catedral. Menú degustación de cocina leonesa.', TRUE, 8.5, 1),
('León Plaza México', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'En el centro histórico de Guanajuato.', 75, 85, 'Blvd. Adolfo López Mateos 1105', 'León', 'México', 4, 21.12164000, -101.68654000, NULL, NULL, '15:00:00', '11:00:00', 'Taller de artesanías en piel. Zona comercial cercana.', TRUE, 9.2, 1),
('Hotel León Nicaragua', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Cerca de la catedral de León.', 30, 55, 'Calle 2a Noroeste', 'León', 'Nicaragua', 3, 12.43464000, -86.87874000, NULL, NULL, '13:00:00', '11:00:00', 'Patio colonial. Clases de español disponibles.', TRUE, 7.3, 1),
('Hotel Sevilla España', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Junto al barrio de Santa Cruz.', 85, 140, 'Calle Daoiz 5', 'Sevilla', 'España', 4, 37.38909200, -5.98445900, NULL, NULL, '14:00:00', '12:00:00', 'Espectáculo flamenco los viernes. Jardines aromáticos.', TRUE, 9.2, 1),
('Sevilla Hostal Colombia', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'En el departamento de Norte de Santander.', 18, 40, 'Carrera 6 #10-20', 'Sevilla', 'Colombia', 2, 8.93965000, -73.20854000, NULL, NULL, '13:00:00', '10:00:00', 'Terraza comunitaria. Intercambio cultural con locales.', TRUE, 5.2, 1),
('Gran Hotel Córdoba Center', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Hotel moderno con vistas panorámicas.', 120, 120, 'Avenida de la Libertad 12', 'Córdoba', 'España', 4, 37.891234, -4.765432, NULL, NULL, '15:00:00', '11:00:00', 'Piscina exterior disponible en temporada.', TRUE, 5.5, 1),
('Hostal Los Arcos de Córdoba', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'Acogedor hostal cerca de la Mezquita.', 20, 45, 'Calleja de las Flores 5', 'Córdoba', 'España', 2, 37.878945, -4.781234, NULL, NULL, '13:00:00', '10:30:00', 'No se permiten fiestas.', TRUE, 5.8, 1),
('Hotel Sevilla Palace', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Lujo en el corazón de Sevilla.', 80, 150, 'Plaza Nueva 1', 'Sevilla', 'España', 5, 37.389092, -5.984459, NULL, NULL, '14:00:00', '12:00:00', 'Spa incluido para estancias mínimas de 2 noches.', TRUE, 9.4, 1),
('Hostal Santa Cruz Sevilla', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'Encanto andaluz en el barrio histórico.', 30, 65, 'Calle Mateos Gago 32', 'Sevilla', 'España', 3, 37.385643, -5.991234, NULL, NULL, '13:00:00', '11:00:00', 'Desayuno incluido.', TRUE, 7.8, 1),
('Hotel Ribera de Triana', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Vistas al río Guadalquivir.', 60, 110, 'Calle Betis 34', 'Sevilla', 'España', 4, 37.382345, -6.002345, NULL, NULL, '15:00:00', '11:00:00', 'Parking privado disponible por suplemento.', TRUE, 8.2, 1),
('Gran Hotel Granada', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Frente a la Alhambra.', 70, 130, 'Recogidas 22', 'Granada', 'España', 4, 37.176487, -3.597929, NULL, NULL, '14:00:00', '12:00:00', 'Terraza con vistas a la Alhambra.', TRUE, 6.8, 1),
('Hostal Darro Granada', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hostel'), 'Ambiente familiar cerca del centro.', 25, 55, 'Carrera del Darro 25', 'Granada', 'España', 2, 37.178765, -3.591234, NULL, NULL, '13:00:00', '10:30:00', 'No fumadores.', TRUE, 5.6, 1),
('Hotel Albaicín Premium', (SELECT id_tipo_alojamiento FROM tipo_alojamiento WHERE nombre = 'Hotel'), 'Vistas únicas al barrio histórico.', 45, 140, 'Camino del Sacromonte 12', 'Granada', 'España', 4, 37.182345, -3.587654, NULL, NULL, '15:00:00', '11:30:00', 'Restaurante con cocina tradicional.', TRUE, 9.0, 1);

ALTER TABLE alojamientos 
RENAME COLUMN nombre TO nombre_aloj;

-- Alojamiento_image
INSERT INTO alojamiento_imagenes (id_alojamiento, url_imagen, es_principal, orden) VALUES
(1, 'https://imgs.search.brave.com/myvo0I2sSkwqbQbHGHVFGw8aQk_zv4T-jR25r6-CM60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNzAw/ODAwMzE2L2VzL2Zv/dG8vYyVDMyVCM3Jk/b2JhLWVuLWFuZGFs/dWMlQzMlQURhLWVz/cGElQzMlQjFhLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1k/QXRkUzYtYWNaeGd1/eEc3RXFCNVVtbnRC/X1ByUDg4UkdKZDBv/TjQ0a2trPQ', TRUE, 1),
(2, 'https://imgs.search.brave.com/IoTl6-K16j1X_KsV9vMvchsHAn_bMHOq06PWPh7hHxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aHduc3RhdGljLmNv/bS81MDAvMzUwLzgw/L2ZhbHNlL1M5ejdi/NDZOYklId3RUNXM5/b09qTXJSZEZDcnVV/czFRVHZyeDRUWUZ6/eHpLcWk3S1Z6LnQy/MHMuMXQ4ZEZvZ3Ns/cjFvTTlNWDQ0NUVE/bDd5QWtxeU1RYWNi/OjpuTTpEVTJURDlU/c2E4VWtaRXQyN0tj/Wk1kV01DN2E0MVhY/cFd0ODBHZEhteXpo/dkxaa043UXVib1da/ZGNsOFRpRWhUUWVE/Vm5vUUxKVmxwRktQ/dHhLbC4wXw', TRUE, 1),
(3, 'https://imgs.search.brave.com/EU2qiYxuMtDqmqe7OExJzvh8gI6jy6BaMdRywCpZ5M4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGF6/YS1yZWFsLXN1aXRl/cy5hbGxyb3Nhcmlv/aG90ZWxzLmNvbS9k/YXRhL0ltYWdlcy80/NTB4NDUwdy8zMTAy/LzMxMDI4MC8zMTAy/ODA3MDUvaW1hZ2Ut/cm9zYXJpby1wbGF6/YS1yZWFsLXN1aXRl/cy1ob3RlbC05NS5K/UEVH', TRUE, 1),
(4, 'https://imgs.search.brave.com/xDizL5-bSt2zLrvu6eanwM3Tdwoyoiyl4wR-xdk41gY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG90ZWxlc3RlcXVl/bmRhbWEuY29tLmNv/L2Fzc2V0cy9jYWNo/ZS91cGxvYWRzL2hv/dGVsLXJvc2FyaW8t/ZGUtbWFyLWVjb2hv/dGVsLXRlcXVlbmRh/bWEvbnVldmFzLWZv/dG9zLzM1M3gxOTgv/ZW50cmFkYS1ob3Rl/bC1yb3NhcmlvLWRl/LW1hci1lY29ob3Rl/bC1pc2xhcy1yb3Nh/cmlvLWNvbG9tYmlh/LTE2OTc2MTQyMjYu/SlBH', TRUE, 1),
(5, 'https://imgs.search.brave.com/tWFSvG_xS4Voki-ZRd0IVfCHmqcxt0n9OO5D68HUeec/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2gtaG90ZWxlcy5j/b20vbWVkaWEvdXBs/b2Fkcy9nYWxlcmlh/aG90ZWxlcy9ob3Rl/bC1hLmpwZz9xPXBy/OnNoYXJwL3JzOmZp/bGwvdzo2MDAvaDo0/MDAvZzpjZS9mOmpw/Zw', TRUE, 1),
(6, 'https://imgs.search.brave.com/fsi1KFmfLIP5CFm3JRez4fdrv9RSC3l4xNEo95yJPGY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZi5i/c3RhdGljLmNvbS94/ZGF0YS9pbWFnZXMv/aG90ZWwvc3F1YXJl/NDAwLzU3NDQ5Nzc0/NS53ZWJwP2s9ZGUz/OTBlODU4MDczYWZh/YzgxMWEzY2NiNTA3/N2IyZWVhMzBlZWEx/ZWE3NTk5ZTE4YWU4/YzU2MzMzODk0YjVj/OCZvPQ', TRUE, 1),
(7, 'https://imgs.search.brave.com/S5B9epdO3PNNEUUkpphUgiKwVjsSHjvuxqO4y3sKnyE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTk2/NDcxNTA4L2VzL2Zv/dG8vZGlzdHJpdG8t/ZGUtbWlyYWZsb3Jl/cy1lbi1saW1hLXBl/ciVDMyVCQS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9VEpR/aWlNaFFVVmtILWh4/TWJRbEZPa2NKVFk1/eWtacDdmdDdpRF9L/bzJ6OD0', TRUE, 1),
(8, 'https://imgs.search.brave.com/kvfJF473mwdiI9LkMHJhYwOFWXHc8cRXRiIMjaxw5Bs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2l4c3RhdGlj/LmNvbS9tZWRpYS83/YWI0YmVfY2U5OWI3/ODE3N2Y3NGMzNGIx/ZDczY2ZmMjBkNzUx/NTF-bXYyLmpwZy92/MS9maWxsL3dfMTY5/LGhfMTIzLGFsX2Ms/cV84MCx1c21fMC42/Nl8xLjAwXzAuMDEs/ZW5jX2F2aWYscXVh/bGl0eV9hdXRvLzdh/YjRiZV9jZTk5Yjc4/MTc3Zjc0YzM0YjFk/NzNjZmYyMGQ3NTE1/MX5tdjIuanBn', TRUE, 1),
(9, 'https://imgs.search.brave.com/7Xvn6lsEzDJanlp6g1KV-jrDwaVSfPLUbsA_rlluPxk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnRy/YXZlbGFwaS5jb20v/bG9kZ2luZy8yMDAw/MDAwLzExNDAwMDAv/MTEzMzMwMC8xMTMz/MjI1LzU3NTc4MWY1/X2IuanBn', TRUE, 1),
(10, 'https://imgs.search.brave.com/k340V9R379j8bIDRvXnkGTiD1t6bHoeRiFlP4VVk8Mc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9uaWNh/cmFndWEuaG90ZWxz/LWluLWdyYW5hZGEu/bmV0L2RhdGEvSW1h/Z2VzLzQ1MHg0NTB3/LzE0ODQvMTQ4NDM0/LzE0ODQzNDU2NS9p/bWFnZS1ncmFuYWRh/LWhvdGVsLTk1LkpQ/RUc', TRUE, 1),
(11, 'https://imgs.search.brave.com/zSesO3buYrgO9ZIXXuPyY0Jt9V838OlBtCdsLBXJU14/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZi5i/c3RhdGljLmNvbS94/ZGF0YS9pbWFnZXMv/aG90ZWwvMjcweDIw/MC8xMDUzNTkzNjUu/anBnP2s9MzAzMDhi/NGRjOGU0NDBiYTZm/Mzc2M2VhOWFlMWU0/YTAzNDIzZTVkOGZi/YjJmMmFlOGNhMzI5/NzRjNDIyYzk0YiZv/PQ', TRUE, 1),
(12, 'https://imgs.search.brave.com/1StwBO1LdmzCbCXCucdrkLMPvpr4GHU-uYnP91fd-Ug/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ob3Rl/bC1ydXJhbC1xdWlu/dG8tY2VjaWxpby1t/ZWRlbGxpbi5ob3Rl/bG1peC5lcy9kYXRh/L1Bob3Rvcy9Pcmln/aW5hbFBob3RvLzEx/MzQvMTEzNDQxLzEx/MzQ0MTM1MS9Ib3Rl/bC1SdXJhbC1RdWlu/dG8tQ2VjaWxpby1N/ZWRlbGxpbi1Sb29t/LkpQRUc', TRUE, 1),
(13, 'https://imgs.search.brave.com/N66Xp2VAyKcaBGkXqksM97zn96pF4gzJ2AnXhvkKLvg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aG90ZWxyZWFsZGV0/b2xlZG8uZXMvZmls/ZXMvaG90ZWwtcmVh/bC10b2xlZG9fc2xp/ZGVyMDYuanBn', TRUE, 1),
(14, 'https://imgs.search.brave.com/PvVuUoUxO1zrHjZDT192qPXaKrcgvmO3d__0NV6LZfI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tdWx0/aW1lZGlhLmNvbXVu/aXRhdHZhbGVuY2lh/bmEuY29tLzREN0Yx/QjU1MENBMTQ1QUQ5/RDRDNkQ0MTAwMkQ3/NEVCL2ltZy8xMzQ0/OTExQkQyQ0I0Nzg1/QkU5NzE3NTk3RURC/QTQ2Qy9DVl8tX0lt/YWdlbmVzX0NvbnRl/bnRfLV8xOTIweDEw/ODBfOC5qcGc_cmVz/cG9uc2l2ZQ', TRUE, 1),
(15, 'https://imgs.search.brave.com/hREKVhlyJWt6FI-wYaQMC7DtSD41X20uXn4kGDBn21Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuY29zdGFkZWxz/b2xtYWxhZ2Eub3Jn/L3Zpc2l0YS9zdWJp/ZGFzL2ltYWdlbmVz/LzUvOS9hcmNfMTg1/OTVfbS5qcGc', TRUE, 1),
(16, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/2b/ea/86/patrimonio-turistico.jpg?w=700&h=400&s=1', TRUE, 1),
(17, 'https://storage.googleapis.com/app-engine-imagenes-pro/pro/styles/talla_siete/cloud-storage/2024-07/Hero_42.jpg.webp', TRUE, 1),
(18, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/172534414.jpg?k=05357b2ec17c3e22e894b25afcf4b110005fe82758c3598169ac4400a2c92ed7&o=&hp=1', TRUE, 1),
(19, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/d4/79/08/exterior-view.jpg?w=900&h=500&s=1', TRUE, 1),
(20, 'https://media-cdn.tripadvisor.com/media/photo-s/0d/c3/f4/b0/fachada-y-entrada-al.jpg', TRUE, 1),
(21, 'https://imgs.search.brave.com/LQOHLrW56iyGnhsT5Pt7yG7wPanWjPIJkUDnnLj_F9s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZi5i/c3RhdGljLmNvbS94/ZGF0YS9pbWFnZXMv/aG90ZWwvMjcweDIw/MC8yODQwMTM5NjMu/anBnP2s9NGE2Y2Ri/Zjc0MWRkNTUwMDI0/ODNkYmZjNzYwZjU2/YzY5NWNhZGRjYTYw/MzZhMzBkMjU0NWFj/NmY0NWIwNDA4MyZv/PQ', TRUE, 1),
(22, 'https://imgs.search.brave.com/QD9U5xYTEy32Ks8tIyqvgstgFiitIbd0iJvA145Ka_c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9xLXh4/LmJzdGF0aWMuY29t/L3hkYXRhL2ltYWdl/cy9ob3RlbC8yNzB4/MjAwLzU1NDUwNTY1/Mi5qcGc_az1jNWMw/MjU2Y2U3NjJkODg1/NjU4NzlkMDM2MTA2/OTExYWU0MTI2Y2U3/YWZmNjAyY2VmNWI2/ZWJkYWU0ODQ1MWYx/Jm89', TRUE, 1),
(23, 'https://imgs.search.brave.com/OVFMFRrafHafzLBaLiRDIfVqxX7kRbGQnOZBw3DrIWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZi5i/c3RhdGljLmNvbS94/ZGF0YS9pbWFnZXMv/aG90ZWwvMjcweDIw/MC82ODQ3OTI3NjYu/anBnP2s9YzkyYzEz/ZTRmMDAyOGQwOGY4/MGMyOGVmMWUwMTE0/NjhlNmRjMDY4NjJl/YmNiYzM5NTk4NTEz/NmEwNTMwYmNlNCZv/PQ', TRUE, 1),
(24, 'https://media-cdn.tripadvisor.com/media/photo-s/2f/39/b2/90/exterior.jpg', TRUE, 1),
(25, 'https://i.pinimg.com/236x/c5/0c/fc/c50cfcbd7232cc52917eb3a32986e70f.jpg', TRUE, 1),
(26, 'https://images.trvl-media.com/lodging/1000000/920000/913300/913227/db03b892.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', TRUE, 1),
(27, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBFOrFxnx0B_0AK1cWtJ514PdaA4d63QEkhA&s', TRUE, 1),
(28, 'https://cf.bstatic.com/xdata/images/hotel/270x200/365823263.jpg?k=4c6ca4207f42455c11a1d73eb717ee0c4b8a07704f0ea494aa1efd219beb6a7e&o=', TRUE, 1),
(29, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/21665130.jpg?k=a49571ab9ee7a7b0467744076b489175a17ca01afd52d2e762df5c09bebe1379&o=&hp=1', TRUE, 1),
(30, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/607263498.jpg?k=5d2a92ee529fb237a0b6833c018a75f9fb0cd9c157921242783c40e66cde8c1f&o=&hp=1', TRUE, 1),
(31, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvuSAGVgpjuk3EckMjUr9mAU0rySpd60wF1g&s', TRUE, 1),
(32, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHAZKcwjPvAJIoLc8DLKIpSCpQY6Cp65-HwHfrJdUUOF1xbqM3Hfq__5wWcJMfxA51Xhw&usqp=CAU', TRUE, 1),
(33, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/402088550.jpg?k=6196a9ebfa693b69cfaf4e12eb4fe62a9444dde0ce64368ffeef68a4770295cf&o=&hp=1', TRUE, 1),
(34, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/195573513.jpg?k=5a5e025df72ad59720560e598a40138e9c18d21adc731998bcedbc692c6fb3f0&o=&hp=1', TRUE, 1),
(35, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtvq7h6LKu-XllI0tfzbATpQtqUOLWaQOyLmVaDig3cKzpcrEEcQr02w0fUzznhsGUfhg&usqp=CAU', TRUE, 1),
(36, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtAAzlPOqaIdYkjlLnEwezKbHlKcLx6tlnPA&s', TRUE, 1),
(37, 'https://x.cdrst.com/foto/hotel-sf/11ff0b1a/granderesp/foto-hotel-11ff0070.jpg', TRUE, 1),
(38, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/389671902.jpg?k=c784efe3c2a012b782da8af2a099ce81ce18c128946c8b83d7d3c52812d9a32f&o=&hp=1', TRUE, 1),
(39, 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_267,q_40,w_400/hotelier-images/77/d0/66dde4f43c7f1c01093e39c951b8fb7cdf2d873ec2e49232f8a3aeaa9892.jpeg', TRUE, 1),
(40, 'https://q-xx.bstatic.com/xdata/images/hotel/max500/19887614.jpg?k=cfef9fdb2ce9752342604112fe51f1be12ccfc82c298b50a122280aa59d1afef&o=', TRUE, 1);

UPDATE alojamiento_imagenes
SET url_imagen = 'https://files.wikis.cc/wikisalamanca.wikis.cc/thumb/1/1c/Gran-Hotel-02.JPG/200px-Gran-Hotel-02.JPG'
WHERE id_alojamiento = 17;

select id_alojamiento, nombre, ciudad, pais, estrellas from alojamientos where id_alojamiento > 0;

select * from alojamientos where id_tipo_alojamiento = 4;

-- Insert tipos de habitacion
INSERT INTO `tipo_habitacion` (`nombre`, `descripcion`, `capacidad_adultos`, `capacidad_menores`,`tamanio_m2`, `camas_detalle`, `precio_base`) VALUES
('Habitación Estándar Doble', 'Una habitación cómoda con dos camas individuales o una doble.', 2, 0, 35.00, '2 Camas Individuales', 80.00),
('Habitación Deluxe King', 'Habitación espaciosa con una cama king-size y vista panorámica.', 2, 1, 65.00, '1 Cama King Size', 120.00),
('Suite Ejecutiva', 'Suite de lujo con sala de estar separada y comodidades premium.', 2, 2, 80.00, '1 Cama King Size', 250.00),
('Habitación Familiar', 'Ideal para familias, con espacio para hasta 4 personas.', 2, 2, 70.00, '1 Cama King + 2 Camas Individuales', 150.00),
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

select * from tipo_habitacion;

UPDATE `tipo_habitacion` 
SET 
  `tamanio_m2` = 70.00,
  `camas_detalle` = '1 Cama King + 2 Camas Individuales'
WHERE `id_tipo_habitacion` = 4;

UPDATE `tipo_habitacion` 
SET 
  `tamanio_m2` = 70.00,
  `camas_detalle` = '1 Cama King + 2 Camas Individuales'
WHERE `id_tipo_habitacion` = 4;

ALTER TABLE `habitacion` 
DROP COLUMN plazas;

ALTER TABLE `tipo_habitacion` 
CHANGE COLUMN `capacidad_adultos` `plazas` TINYINT NOT NULL DEFAULT 2;

select * from reservas;

-- Alojamiento 1: Hotel Patios de Córdoba (España)
INSERT INTO `habitaciones` (`numero_habitacion`, `id_tipo_habitacion`, `estado`, `id_alojamiento`, `notas`) VALUES
('101', 1, 'habilitada', 1, 'Vista al patio interior, piso bajo'),
('201', 2, 'habilitada', 1, 'Vista a la calle, cama king size'),
-- Alojamiento 2: Gran Hotel Córdoba Argentina
('501', 3, 'habilitada', 2, 'Suite con jacuzzi, piso alto'),
('302', 4, 'habilitada', 2, 'Habitación familiar, conexión para niños'),
-- Alojamiento 3: Rosario Plaza Hotel (Argentina)
('12A', 1, 'habilitada', 3, 'Vista al río Paraná'),
('15B', 2, 'habilitada', 3, 'Habitación deluxe, minibar incluido'),
-- Alojamiento 4: Hotel Rosario Colombia
('102', 1, 'habilitada', 4, 'Vista a la piscina'),
('205', 5, 'habilitada', 4, 'Habitación accesible, cerca del ascensor'),
-- Alojamiento 5: Hotel Valencia Palace (España)
('301', 3, 'habilitada', 5, 'Suite con terraza privada'),
('412', 6, 'habilitada', 5, 'Habitación económica, vista interior'),
-- Alojamiento 6: Valencia Suites (Venezuela)
('S1', 3, 'habilitada', 6, 'Suite principal con sala de estar'),
('S5', 7, 'habilitada', 6, 'Suite presidencial, servicio VIP'),
-- Alojamiento 7: Hotel Lima Perú
('OC1', 2, 'habilitada', 7, 'Vista al océano Pacífico'),
('IC3', 1, 'habilitada', 7, 'Habitación estándar, vista interior'),
-- Alojamiento 8: Lima Inn Ohio (EEUU)
('10', 6, 'habilitada', 8, 'Habitación individual, wifi rápido'),
('21', 1, 'habilitada', 8, 'Habitación doble estándar'),
-- Alojamiento 9: Parador de Granada (España)
('AL1', 3, 'habilitada', 9, 'Suite con vistas directas a la Alhambra'),
('CL2', 2, 'habilitada', 9, 'Habitación deluxe, estilo árabe'),
-- Alojamiento 10: Granada Hotel Nicaragua
('G1', 2, 'habilitada', 10, 'Vista al lago Cocibolca'),
('G5', 8, 'habilitada', 10, 'Habitación con jacuzzi privado'),
-- Alojamiento 11: Hotel Medellín Colombia
('POB101', 2, 'habilitada', 11, 'Vista al barrio El Poblado'),
('POB205', 4, 'habilitada', 11, 'Habitación familiar, piso alto'),
-- Alojamiento 12: Medellín Rural House (España)
('C1', 9, 'habilitada', 12, 'Casa completa, 3 dormitorios'),
('C2', 10, 'habilitada', 12, 'Dormitorio colectivo, 6 camas'),
-- Alojamiento 13: Hotel Toledo España
('T101', 2, 'habilitada', 13, 'Vista a la catedral'),
('T202', 3, 'habilitada', 13, 'Suite en antigua celda monacal'),
-- Alojamiento 14: Toledo Grand Hotel (EEUU)
('OH1', 1, 'habilitada', 14, 'Habitación estándar doble'),
('OH5', 2, 'habilitada', 14, 'Habitación ejecutiva, escritorio amplio'),
-- Alojamiento 15: Hotel Málaga Palacio (España)
('MP101', 2, 'habilitada', 15, 'Vista al puerto deportivo'),
('MP301', 3, 'habilitada', 15, 'Suite con balcón panorámico'),
-- Alojamiento 16: Málaga Hostel Colombia
('D1', 10, 'habilitada', 16, 'Dormitorio femenino, 4 camas'),
('D2', 10, 'habilitada', 16, 'Dormitorio mixto, 6 camas'),
-- Alojamiento 17: Hotel Salamanca Plaza (España)
('SP1', 2, 'habilitada', 17, 'Vista a la Plaza Mayor'),
('SP3', 1, 'habilitada', 17, 'Habitación clásica, decoración tradicional'),
-- Alojamiento 18: Salamanca Grand México
('SG101', 1, 'habilitada', 18, 'Habitación estándar para ejecutivos'),
('SG201', 2, 'habilitada', 18, 'Habitación deluxe, zona de trabajo'),
-- Alojamiento 19: Hotel Burgos Centro (España)
('BC1', 1, 'habilitada', 19, 'Vista lateral a la catedral'),
('BC5', 2, 'habilitada', 19, 'Habitación superior, cama king'),
-- Alojamiento 20: Burgos Hostel Colombia
('BH1', 10, 'habilitada', 20, 'Dormitorio con hamacas'),
('BH2', 10, 'habilitada', 20, 'Dormitorio con literas'),
-- Alojamiento 21: Hotel Santa Cruz Tenerife (España)
('T101', 2, 'habilitada', 21, 'Vista al océano Atlántico, balcón privado'),
('T205', 3, 'reservada', 21, 'Suite con jacuzzi, piscina en azotea'),
-- Alojamiento 22: Santa Cruz Inn Bolivia
('B1', 1, 'habilitada', 22, 'Habitación económica, ventilador de techo'),
('B5', 6, 'habilitada', 22, 'Habitación superior, aire acondicionado'),
-- Alojamiento 23: Santa Cruz Beach Hotel (EEUU)
('SB101', 2, 2, 160.00, 'habilitada', 23, 'Primera línea de playa, salida directa'),
('SB302', 8, 2, 190.00,'habilitada', 23, 'Suite con fogata privada en terraza'),
('SB355', 3, 2, 280.00, 'habilitada', 23, 'Sala de trabajo independiente, minibar premium'),
-- Alojamiento 24: Hotel San José Costa Rica
('CR101', 2, 'habilitada', 24, 'Vista al jardín tropical'),
('CR201', 4, 'habilitada', 24, 'Habitación familiar, hamacas en balcón'),
-- Alojamiento 25: San José Inn California (EEUU)
('SJ101', 7, 'habilitada', 25, 'Habitación tecnológica, escritorio ejecutivo'),
('SJ202', 1, 'habilitada', 25, 'Habitación estándar, conexión VPN premium'),
-- Alojamiento 26: Hotel Palencia España
('PL1', 1, 'habilitada', 26, 'Vista a la calle Mayor, bicicleta incluida'),
('PL3', 2, 'habilitada', 26, 'Habitación deluxe, cama king size'),
-- Alojamiento 27: Palencia Suites México
('MX1', 3, 'habilitada', 27, 'Suite con decoración yucateca'),
('MX5', 3, 'habilitada', 27, 'Suite con excursión a cenote incluida'),
-- Alojamiento 28: Hotel León España
('LN1', 2, 'habilitada', 28, 'Vista a la catedral gótica'),
('LN3', 5, 'habilitada', 28, 'Habitación temática leonesa, menú degustación'),
-- Alojamiento 29: León Plaza México
('LM1', 2, 'habilitada', 29, 'Habitación ejecutiva, zona de trabajo'),
('LM4', 9, 'habilitada', 29, 'Suite con taller de artesanías en piel'),
-- Alojamiento 30: Hotel León Nicaragua
('NI1', 1, 'habilitada', 30, 'Habitación colonial, patio interior'),
('NI3', 2, 'habilitada', 30, 'Habitación con clases de español incluidas'),
-- Alojamiento 31: Hotel Sevilla España
('SV1', 2, 'habilitada', 31, 'Vista al barrio de Santa Cruz'),
('SV3', 3, 'habilitada', 31, 'Suite con espectáculo flamenco privado'),
-- Alojamiento 32: Sevilla Hostal Colombia
('SH1', 10, 'habilitada', 32, 'Dormitorio con terraza comunitaria'),
('SH2', 10, 'habilitada', 32, 'Dormitorio con actividades culturales'),
-- Alojamiento 33: Gran Hotel Córdoba Center (España)
('GC101', 2, 'habilitada', 33, 'Vista panorámica de la ciudad'),
('GC301', 3, 'habilitada', 33, 'Suite con acceso a piscina exterior'),
-- Alojamiento 34: Hostal Los Arcos de Córdoba (España)
('CA1', 1, 'habilitada', 34, 'Habitación sencilla cerca de la Mezquita'),
('CA3', 1, 'habilitada', 34, 'Habitación doble, estilo andaluz'),
-- Alojamiento 35: Hotel Sevilla Palace (España)
('SP101', 3, 'habilitada', 35, 'Suite de lujo con spa privado'),
('SP201', 2, 'habilitada', 35, 'Habitación deluxe, plaza Nueva vista'),
-- Alojamiento 36: Hostal Santa Cruz Sevilla (España)
('SC1', 1, 'habilitada', 36, 'Habitación con desayuno incluido'),
('SC3', 1, 'habilitada', 36, 'Habitación estilo tradicional sevillano'),
-- Alojamiento 37: Hotel Ribera de Triana (España)
('RT1', 2, 'habilitada', 37, 'Vista al río Guadalquivir'),
('RT3', 2, 'habilitada', 37, 'Habitación con parking reservado'),
-- Alojamiento 38: Gran Hotel Granada (España)
('GR1', 3, 'habilitada', 38, 'Suite con vistas directas a la Alhambra'),
('GR3', 2, 'habilitada', 38, 'Habitación deluxe, terraza privada'),
-- Alojamiento 39: Hostal Darro Granada (España)
('DR1', 1, 'habilitada', 39, 'Habitación no fumadores, ambiente familiar'),
('DR3', 1, 'habilitada', 39, 'Habitación con vistas al río Darro'),
-- Alojamiento 40: Hotel Albaicín Premium (España)
('AL1', 3, 'habilitada', 40, 'Suite premium con vistas al Albaicín'),
('AL3', 2, 'habilitada', 40, 'Habitación con restaurante gourmet');


select * from habitaciones;

UPDATE habitaciones h
JOIN (
  SELECT id_alojamiento, precio
  FROM alojamientos
) a ON h.id_alojamiento = a.id_alojamiento
SET h.precio = a.precio;

INSERT INTO `habitaciones` (
  `numero_habitacion`, `id_tipo_habitacion`, `plazas`, `precio`, 
  `estado`, `id_alojamiento`, `notas`
) VALUES 
('SB102', 2, 2, 160.00, 'habilitada', 23, 'Primera línea de playa, salida directa'),
('SB303', 8, 2, 190.00, 'habilitada', 23, 'Suite con fogata privada en terraza'),
('SB356', 3, 2, 280.00, 'habilitada', 23, 'Sala de trabajo independiente, minibar premium'),
('SB103', 2, 2, 160.00, 'habilitada', 23, 'Primera línea de playa, salida directa'),
('SB304', 8, 2, 190.00, 'habilitada', 23, 'Suite con fogata privada en terraza'),
('SB357', 3, 2, 280.00, 'habilitada', 23, 'Sala de trabajo independiente, minibar premium'),
('SB104', 2, 2, 160.00, 'habilitada', 23, 'Primera línea de playa, salida directa'),
('SB305', 8, 2, 190.00, 'habilitada', 23, 'Suite con fogata privada en terraza'),
('SB358', 3, 2, 280.00, 'habilitada', 23, 'Sala de trabajo independiente, minibar premium');

-- Habitación Estándar Doble (ID 1)
INSERT INTO `habitacion_tipo_caracteristica` (`id_tipo_habitacion`, `id_caracteristica`) VALUES
(1, 1), (1, 2), (1, 3), (1, 12), (1, 15),
-- Habitación Deluxe King (ID 2)
(2, 1), (2, 2), (2, 3), (2, 4), (2, 7), (2, 15),
-- Suite Ejecutiva (ID 3)
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 9), (3, 13),
-- Habitación Familiar (ID 4)
(4, 1), (4, 2), (4, 3), (4, 12), (4, 14), (4, 15),
-- Habitación Superior con Terraza (ID 5)
(5, 1), (5, 2), (5, 3), (5, 7), (5, 8), (5, 13),
-- Suite Nupcial (ID 6)
(6, 1), (6, 2), (6, 3), (6, 4), (6, 6), (6, 9), (6, 10),
-- Habitación Triple (ID 7)
(7, 1), (7, 2), (7, 3), (7, 12), (7, 15),
-- Suite Familiar Deluxe (ID 8)
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 9), (8, 13),
-- Habitación Accesible (ID 9)
(9, 1), (9, 2), (9, 3), (9, 11), (9, 12), (9, 15),
-- Habitación Económica Individual (ID 10)
(10, 1), (10, 12), (10, 15),
-- Suite Presidencial (ID 11)
(11, 1), (11, 2), (11, 3), (11, 4), (11, 5), (11, 6), (11, 9), (11, 10), (11, 13),
-- Habitación con Jacuzzi (ID 12)
(12, 1), (12, 2), (12, 3), (12, 6), (12, 10), (12, 13),
-- Habitación Connecting (ID 13)
(13, 1), (13, 2), (13, 3), (13, 12), (13, 14), (13, 15),
-- Dormitorio Colectivo (ID 14)
(14, 1), (14, 12), (14, 15);

-- Ver ralaciones de caracteristicas con tipo_habitacion
SELECT 
  th.nombre AS tipo_habitacion,
  GROUP_CONCAT(ch.nombre SEPARATOR ', ') AS caracteristicas,
  COUNT(*) AS total_caracteristicas
FROM tipo_habitacion th
JOIN habitacion_tipo_caracteristica htc ON th.id_tipo_habitacion = htc.id_tipo_habitacion
JOIN caracteristicas_habitacion ch ON htc.id_caracteristica = ch.id_caracteristica
GROUP BY th.id_tipo_habitacion;

-- inserts para las caracteristicas que tiene cada alojamiento
INSERT INTO alojamiento_caracteristica VALUES
(1,1),(1,3),(1,4),(1,8),(1,10),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,10),
(3,1),(3,2),(3,3),(3,4),(3,6),(3,8),(3,10),
(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,10),
(9,1),(9,3),(9,4),(9,6),(9,7),(9,8),(9,10),
(11,1),(11,3),(11,5),(11,8),(11,10),
(13,1),(13,3),(13,8),(13,9),(13,10),
(15,1),(15,2),(15,3),(15,6),(15,7),(15,8),(15,10),
(21,1),(21,2),(21,3),(21,6),(21,8),(21,10),
(24,1),(24,3),(24,6),(24,8),(24,10),
(28,1),(28,3),(28,6),(28,8),(28,10),
(31,1),(31,3),(31,6),(31,8),(31,10),
(33,1),(33,2),(33,3),(33,4),(33,8),(33,10),
(35,1),(35,2),(35,3),(35,6),(35,7),(35,8),(35,10),
(38,1),(38,3),(38,6),(38,8),(38,10),
(40,1),(40,3),(40,6),(40,8),(40,10),
(10,1),(10,8),(10,10),
(14,1),(14,4),(14,8),(14,10),
(17,1),(17,3),(17,8),(17,10),
(19,1),(19,3),(19,8),(19,10),
(22,1),(22,8),
(25,1),(25,4),(25,8),(25,10),
(26,1),(26,3),(26,8),(26,10),
(29,1),(29,4),(29,8),(29,10),
(30,1),(30,8),
(34,1),(34,3),
(36,1),(36,3),
(37,1),(37,4),(37,8),(37,10),
(39,1),(39,9),
(4,1),(4,8),
(6,1),(6,7),
(7,1),(7,2),(7,8),
(8,1),(8,3),(8,4),
(12,1),(12,9),
(16,1),
(18,1),(18,4),(18,10),
(20,1),
(23,1),(23,2),(23,4),
(27,1),(27,8),
(32,1);

select count(*) from alojamiento_caracteristica;

select a.nombre, c.nombre from caracteristica c
join alojamiento_caracteristica ac on c.id_caracteristica = ac.id_caracteristica
join alojamientos a on a.id_alojamiento = ac.id_alojamiento
where a.id_alojamiento = 21;

INSERT INTO `caracteristicas_habitacion` (`nombre`, `icono`, `es_prioritario`) VALUES
('WiFi Gratis', 'wifi', TRUE),
('Aire Acondicionado', 'snowflake', TRUE),
('Televisión Pantalla Plana', 'tv', TRUE),
('Minibar', 'glass-martini-alt', FALSE),
('Caja Fuerte', 'lock', FALSE),
('Jacuzzi Privado', 'hot-tub', TRUE),
('Vista al Mar', 'mountain', TRUE),
('Balcón/Terraza', 'door-open', FALSE),
('Room Service 24h', 'concierge-bell', FALSE),
('Bañera Hidromasaje', 'bath', FALSE),
('Adaptado para Movilidad Reducida', 'wheelchair', TRUE),
('Calefacción', 'temperature-low', FALSE),
('Cafetera Nespresso', 'coffee', FALSE),
('Plancha y Tabla de Planchar', 'iron', FALSE),
('Secador de Pelo', 'wind', FALSE);

select * from caracteristicas_habitacion;

INSERT INTO puntaje (id_alojamiento, puntuacion, comentario, id_usuario) VALUES
(23, 7.7, 'Muy buena atencion, exelentes vistas naturales.', 5),
(23, 8.4, 'Volvere el año que viene, muy buena relacion precio calidad.', 7),
-- Hoteles con puntajes altos (8.0+)
(3, 9.2, 'Excelente ubicación con vistas impresionantes al río. El servicio fue impecable y las instalaciones muy limpias.', 3),
(10, 8.5, 'Hermoso hotel colonial con un ambiente muy auténtico. La terraza con vista al lago es increíble.', 4),
(15, 9.5, 'La ubicación frente al puerto es perfecta. Las habitaciones son espaciosas y el personal muy atento.', 5),
(23, 8.1, 'Perfecto para amantes del surf. Las fogatas en la playa son una experiencia única.', 6),
(24, 8.4, 'El jardín tropical es un oasis en la ciudad. Desayuno con frutas frescas deliciosas.', 7),
(25, 8.4, 'Muy buena conexión a internet, ideal para viajeros de negocios. Habitaciones cómodas y modernas.', 8),
(28, 8.5, 'Increíble ubicación junto a la catedral. La comida local en el restaurante es exquisita.', 3),
(29, 9.2, 'Excelente servicio y ubicación. Las actividades de artesanía en piel son muy interesantes.', 4),
(31, 9.2, 'El espectáculo de flamenco los viernes es imperdible. Hermosos jardines y decoración.', 5),
(35, 9.4, 'Puro lujo en el centro de Sevilla. El spa es maravilloso y vale cada euro.', 6),
(40, 9.0, 'Las vistas al Albaicín son espectaculares. Restaurante con cocina tradicional excelente.', 7),

-- Hoteles con puntajes medios (6.0-7.9)
(1, 7.2, 'Buen hotel en ubicación céntrica. Habitaciones limpias pero algo pequeñas.', 3),
(5, 6.9, 'Buenas instalaciones aunque el precio es algo elevado para lo que ofrece.', 4),
(7, 6.7, 'Vistas al mar muy bonitas. La piscina climatizada es un buen plus.',5),
(8, 7.4, 'Hotel sencillo pero cumplidor. El desayuno continental está bien.',6),
(9, 6.4, 'El entorno histórico es increíble aunque las habitaciones necesitan renovación.',7),
(12, 6.4, 'Casa rural acogedora. Ideal para escapadas tranquilas en familia.',8),
(14, 7.3, 'Buen hotel de negocios. El centro de negocios es muy útil.' ,3),
(17, 7.4, 'Ubicación perfecta en la Plaza Mayor. La biblioteca es un detalle encantador.', 4),
(19, 8.1, 'Muy buena relación calidad-precio. Los tours históricos son muy informativos.', 5),
(21, 7.5, 'La piscina en la azotea con vistas al océano es fantástica.', 6),
(22, 7.2, 'Hotel económico pero limpio. Buen ubicación para explorar la ciudad.', 7),
(26, 5.5, 'Hotel correcto aunque algo impersonal. Las bicicletas gratuitas son un buen detalle.', 8),
(27, 6.2, 'Suites cómodas para estancias cortas. El aire acondicionado funciona muy bien.', 3),
(30, 7.3, 'Patio colonial muy agradable. Buen punto de partida para explorar León.', 4),
(33, 5.5, 'Hotel moderno pero algo frío en su decoración. Buenas vistas desde las habitaciones superiores.', 5),
(36, 7.9, 'Hostal con mucho encanto andaluz. El desayuno incluido es buena calidad.', 6),
(37, 8.2, 'Vistas al río preciosas. Parking algo caro pero conveniente.', 7),
(38, 6.8, 'Buena terraza con vistas. Algunas áreas necesitan mantenimiento.', 8),

-- Hoteles con puntajes bajos (5.0-5.9)
(2, 5.1, 'El casino es ruidoso hasta altas horas. Las habitaciones necesitan renovación.', 3),
(4, 6.3, 'Ubicación práctica cerca del centro comercial. Las habitaciones son algo básicas.', 4),
(6, 5.1, 'Suites modernas pero el servicio podría mejorar. WiFi lento.', 5),
(11, 5.0, 'Barrio exclusivo pero el hotel no cumple las expectativas. Gimnasio pequeño.', 6),
(13, 5.5, 'Antiguo convento con mucho carácter pero problemas de aislamiento acústico.', 7),
(16, 5.4, 'Hostal económico para estancias cortas. Las habitaciones compartidas están limpias.', 8),
(18, 6.4, 'Hotel de negocios funcional. Las salas de reuniones están bien equipadas.', 3),
(20, 6.0, 'Hostal básico pero correcto para mochileros. Actividades grupales divertidas.', 4),
(32, 5.2, 'Hostal económico con ambiente familiar. Terraza comunitaria agradable.', 5),
(34, 5.8, 'Hostal sencillo cerca de la Mezquita. Correcto para presupuestos ajustados.', 6),
(39, 5.6, 'Ambiente familiar agradable pero instalaciones algo antiguas.', 7);

INSERT INTO puntaje (id_alojamiento, puntuacion, comentario, id_usuario, publicado)
VALUES
    (21, 9.6, 'Muy buena experiencia, el personal es amable y las instalaciones excelentes.', 8, TRUE);

select * from puntaje;

select * from puntaje where id_alojamiento = 21;

select * from alojamientos where id_alojamiento = 21;

SELECT puntaje.*, usuarios.nombre, usuarios.apellido FROM puntaje
JOIN usuarios ON puntaje.id_usuario = usuarios.id_usuario
JOIN alojamientos ON puntaje.id_alojamiento = alojamientos.id_alojamiento
WHERE puntaje.id_alojamiento = 23;


INSERT INTO reservas (id_usuario, id_habitacion, id_alojamiento, checkin, checkout, adultos, menores, estado)
VALUES
(6, 163, 23, '2025-06-25', '2025-06-27', 3, 0, 'pendiente', 160.00),
(6, 126, 23, '2025-06-25', '2025-06-27', 3, 0, 'pendiente', 160.00),
(3, 122, 21, '2025-06-05', '2025-06-07', 2, 1, 'reservada', 220.00),
(4, 123, 22, '2025-06-06', '2025-06-10', 1, 0, 'pagada', 180.00),
(5, 124, 23, '2025-06-27', '2025-06-30', 2, 2, 'pendiente', 160.00),
(6, 125, 21, '2025-06-09', '2025-06-11', 1, 0, 'activa', 220.00),
(7, 126, 22, '2025-06-10', '2025-06-13', 2, 1, 'reservada', 135.00),
(8, 127, 23, '2025-06-11', '2025-06-15', 3, 0, 'pendiente', 320.00),
(3, 122, 21, '2025-06-12', '2025-06-14', 2, 2, 'pagada', 220.00),
(4, 123, 22, '2025-06-13', '2025-06-16', 1, 0, 'cancelada', 135.00),
(5, 124, 23, '2025-06-14', '2025-06-17', 2, 0, 'reservada', 480.00),
(6, 125, 21, '2025-06-15', '2025-06-18', 2, 1, 'activa', 330.00);

delete from reservas where id > 0;

select * from reservas
where checkin > '2025-06-04' and checkout < '2025-06-08';

select * from habitaciones where id_alojamiento = 21 or id_alojamiento = 22 or id_alojamiento = 23;
select * from alojamientos where id_alojamiento = 21 or id_alojamiento = 22 or id_alojamiento = 23;
select * from habitaciones where id_tipo_habitacion = 2 && id_alojamiento = 23;

SELECT 
      a.id_alojamiento,
      a.nombre_aloj,
      a.ciudad,
      a.pais,
      a.estrellas,
      th.nombre,
      h.*
    FROM alojamientos a
    JOIN habitaciones h ON h.id_alojamiento = a.id_alojamiento
    JOIN tipo_habitacion th ON h.id_tipo_habitacion = th.id_tipo_habitacion
    WHERE a.activo = TRUE
    AND h.id_habitacion NOT IN (
        SELECT r.id_habitacion
        FROM reservas r
        WHERE 
          r.id_habitacion = h.id_habitacion
          AND r.checkin < '2025-06-10'  -- Fecha checkout del usuario
          AND r.checkout > '2025-06-11'  -- Fecha checkin del usuario
      )
      AND h.estado = 'habilitada'
      AND (a.ciudad LIKE 'santa cruz')
      ;
      
      
      
SELECT r.id_habitacion
        FROM reservas r
        WHERE 
           r.checkin < '2025-06-10'
          AND r.checkout > '2025-06-11';