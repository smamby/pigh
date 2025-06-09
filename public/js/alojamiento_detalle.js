document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'http://localhost:3001/api';
    const contenedor = document.getElementById('alojamiento-detalle-dinamico');
    const urlParams = new URLSearchParams(window.location.search);
    const alojamientoId = urlParams.get('id');

    if (!alojamientoId) {
        contenedor.innerHTML = '<p class="error">No se especificó un ID de alojamiento.</p>';
        return;
    }

    try {
        // Traer datos del alojamiento
        const resAloj = await fetch(`${API_BASE_URL}/alojamientos/${alojamientoId}`);
        if (!resAloj.ok) throw new Error('Alojamiento no encontrado');
        const alojamiento = await resAloj.json();

        // Traer imágenes
        const resImg = await fetch(`${API_BASE_URL}/img_alojamientos/${alojamientoId}`);
        const imagenes = await resImg.json();

        // Usar la primera como principal, el resto como galería
        const fotoPrincipal = imagenes[0]?.url_imagen || '';
        const galeria = imagenes.slice(1).map(img => img.url_imagen);

        // Breadcrumb (ruta) - sin fondo blanco
        const breadcrumbHTML = `
            <nav class="breadcrumb" style="border-radius:8px; padding:0.7em 1.2em; margin:1.5em 0;">
                <span style="font-weight:bold; color: #16B0DA;">Inicio</span>
                <span class="breadcrumb-separator">›</span>
                <span style="font-weight:bold; color:#16B0DA;">${alojamiento.tipo_alojamiento || 'Hoteles'}</span>
                <span class="breadcrumb-separator">›</span>
                <span style="font-weight:bold; color:#16B0DA;">${alojamiento.pais}</span>
                <span class="breadcrumb-separator">›</span>
                <span style="font-weight:bold; color:#16B0DA;">${alojamiento.ciudad}</span>
                <span class="breadcrumb-separator">›</span>
                <span style="color:#1f2937; font-weight:normal;">Habitaciones en ${alojamiento.nombre}</span>
            </nav>
        `;

        // Buscador superior (igual al de la home)
        const buscadorSuperior = `
        <div class="buscador-superior" style="width:100%; background:#f3f4f6; border-radius:12px; display:flex; align-items:center; gap:1.5em; padding:1.2em 2em; margin-bottom:2em;">
            <div>
                <label style="font-weight:bold;">Destino</label><br>
                <input type="text" value="${alojamiento.ciudad}" style="padding:0.5em; border-radius:6px; border:1px solid #ccc; width:140px;">
            </div>
            <div>
                <label style="font-weight:bold;">Check in</label><br>
                <input type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div>
                <label style="font-weight:bold;">Check out</label><br>
                <input type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
            </div>
            <div>
                <label style="font-weight:bold;">Huéspedes</label><br>
                <input type="number" min="1" max="10" value="2" style="padding:0.5em; border-radius:6px; border:1px solid #ccc; width:60px;">
            </div>
            <button style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer;">Buscar</button>
        </div>
        `;

        // Galería de fotos (rellena con la principal si faltan)
        const fotos = [fotoPrincipal, ...galeria].filter(Boolean);
        while (fotos.length < 8) fotos.push(fotos[0] || '');

        const galeriaHTML = `
        <div class="galeria-fotos" style="display:flex; gap:18px;">
            <div style="flex:2; display:flex; flex-direction:column; gap:8px;">
                <img src="${fotos[0]}" alt="Foto principal" style="width:100%; height:260px; object-fit:cover; border-radius:14px;">
                <div style="display:flex; gap:8px;">
                    <img src="${fotos[3]}" alt="" style="width:24%; height:70px; object-fit:cover; border-radius:8px;">
                    <img src="${fotos[4]}" alt="" style="width:24%; height:70px; object-fit:cover; border-radius:8px;">
                    <img src="${fotos[5]}" alt="" style="width:24%; height:70px; object-fit:cover; border-radius:8px;">
                    <img src="${fotos[6]}" alt="" style="width:24%; height:70px; object-fit:cover; border-radius:8px;">
                </div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                <img src="${fotos[1]}" alt="" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">
                <img src="${fotos[2]}" alt="" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">
            </div>
        </div>
        `;

        // Mapa
        const mapQuery = encodeURIComponent(`${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}`);
        const mapaMini = `
            <a href="https://maps.google.com/?q=${mapQuery}" target="_blank" style="display:block;">
                <iframe
                    src="https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed"
                    width="100%" height="180" style="border-radius:10px; border:0;"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </a>
        `;

        // Side info: mapa más grande, comentarios más pequeños
        const sideInfoHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1em; margin-top:5em; width:80%;">
            <div class="box-puntuacion" style="max-width:208px; width:100%; margin-bottom:0; font-size:0.85em;">
                <div style="font-weight:bold; font-size:1em; margin-right:1em;">¡Muy bueno!</div>
                <div style="background:#16B0DA; color:#fff; border-radius:8px; padding:0.3em 0.8em; font-size:1em; font-weight:bold;">${alojamiento.promedio_puntaje || 8.7}</div>
            </div>
            <div class="box-comentarios" style="max-width:120px; width:100%; margin-bottom:0; font-size:0.8em;">
                <span class="texto-placeholder" style="font-size:0.92em;">"Excelente atención y ubicación."<br><b>- Ejemplo</b></span>
            </div>
            <div style="max-width:280px; width:100%;">${mapaMini}</div>
        </div>
        `;

        // Botón reservar arriba, hace scroll a la tabla de disponibilidad
        const reservarBtn = `
            <button onclick="document.getElementById('tabla-disponibilidad').scrollIntoView({behavior:'smooth'});" 
                style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer; margin-left:2em;">
                Reservar
            </button>
        `;

        // Render principal
        contenedor.innerHTML = `
            ${breadcrumbHTML}
            ${buscadorSuperior}
            <div style="display:flex; gap:32px; align-items:flex-start; margin-bottom:2em;">
                <div style="flex:3; min-width:0;">
                    <div class="hotel-card" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1em; width:85vw; max-width:1200px; min-width:600px; height:68px; background:#fff; border-radius:12px; box-shadow:0 2px 8px #0001; padding:0.7em 2.5em;">
                        <div style="display:flex; flex-direction:column; align-items:flex-start; flex:1;">
                            <div style="display:flex; align-items:center; flex-wrap:wrap;">
                                <span class="nombre" style="font-size:1.35em; font-weight:bold; vertical-align:middle; margin-right:0.7em; white-space:nowrap; line-height:1;">
                                    ${alojamiento.nombre}
                                </span>
                                <span class="estrellas" style="font-size:1.05em; color:#FFD700; vertical-align:middle; margin-right:1em; white-space:nowrap;">${'★'.repeat(alojamiento.estrellas || 4)}</span>
                            </div>
                            <div class="direccion" style="font-size:0.98em; color:#444; margin-top:0.1em; line-height:1.2;">
                                ${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}
                                <a href="https://maps.google.com/?q=${mapQuery}" target="_blank" style="font-weight:bold; color:#16B0DA; margin-left:0.7em; text-decoration:none; font-size:0.97em;">Mapa</a>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:1em;">
                            <div class="icon" title="Like" style="cursor:pointer;"><i class="far fa-heart icon-heart"></i></div>
                            <a href="#" class="icon" title="Compartir" style="color:#16B0DA;"><i class="fa-solid fa-share-nodes icon-share"></i></a>
                            ${reservarBtn}
                        </div>
                    </div>
                    ${galeriaHTML}
                    <h3 class="titulo-servicios" style="margin-top:2em;">Servicios</h3>
                    <ul class="servicios-lista">
                        ${(alojamiento.servicios || ['WiFi','Desayuno','Estacionamiento','Piscina']).map(s => `<li class="servicio-item">${s}</li>`).join('')}
                    </ul>
                    <section class="detalle-info" style="margin-top:2em;">
                        <h2>Descripción</h2>
                        <p>${alojamiento.descripcion || 'No disponible.'}</p>
                        <hr style="margin:1.5em 0 0.5em 0; border:0; border-top:1.5px solid #e5e7eb;">
                    </section>
                    <h2 style="margin-top:2.5em;">Disponibilidad</h2>
                    <div class="buscador-disponibilidad" style="width:100%; background:#f3f4f6; border-radius:12px; display:flex; align-items:center; gap:1.5em; padding:1.2em 2em; margin-bottom:2em;">
                        <div>
                            <label style="font-weight:bold;">Check in</label><br>
                            <input type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
                        </div>
                        <div>
                            <label style="font-weight:bold;">Check out</label><br>
                            <input type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
                        </div>
                        <div>
                            <label style="font-weight:bold;">Huéspedes</label><br>
                            <input type="number" min="1" max="10" value="2" style="padding:0.5em; border-radius:6px; border:1px solid #ccc; width:60px;">
                        </div>
                        <button style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer;">Modificar búsqueda</button>
                    </div>
                    <div id="tabla-disponibilidad"></div>
                    <h2 style="margin-top:2.5em;">Comentarios de los clientes</h2>
                    <div style="background:#f3f4f6; border-radius:14px; border:1.5px solid #4c76b2; padding:1.2em 1.5em; margin-bottom:1.2em;">
                        <span style="font-weight:bold; font-size:0.98em;">Puntuación pormenorizada de cada servicio</span>
                    </div>
                    <div style="background:#f3f4f6; border-radius:14px; border:1.5px solid #4c76b2; padding:1.2em 1.5em; margin-bottom:2em;">
                        <span style="font-weight:bold; font-size:0.98em;">Comentarios de los clientes</span>
                    </div>
                    <h2 style="margin-top:2.5em;">Normas de la Casa</h2>
                    <div style="background:#f3f4f6; border-radius:14px; border:1.5px solid #4c76b2; padding:1.2em 1.5em; margin-bottom:2em;">
                        <span style="font-weight:bold; font-size:0.98em;">Detalle de las Normas de la Casa (horarios check in y check out, horario desayuno, parking, etc)</span>
                    </div>
                </div>
                <div style="flex:1; min-width:208px; align-self:stretch; display:flex;">
                    ${sideInfoHTML}
                </div>
            </div>
        `;

        // Render tabla de disponibilidad con formato y estilos
        document.getElementById('tabla-disponibilidad').innerHTML = `
        <table style="width:100%; border-collapse:separate; border-spacing:0; font-size:1em; border:1.5px solid #4c76b2; border-radius:10px;">
            <thead>
                <tr>
                    <th rowspan="2" style="background:#4c76b2; color:#fff; font-weight:bold; text-align:left; border-radius:8px 0 0 0; padding:1em 1em; border-right:1.5px solid #4c76b2; transition:background 0.2s;">Tipo de Habitación</th>
                    <th style="background:#4c76b2; color:#fff; font-weight:bold; text-align:center; border-right:1.5px solid #4c76b2; transition:background 0.2s;">Cant. Huéspedes</th>
                    <th style="background:#4c76b2; color:#fff; font-weight:bold; text-align:center; border-right:1.5px solid #4c76b2; transition:background 0.2s;">Precio por 2 noches</th>
                    <th style="background:#4c76b2; color:#fff; font-weight:bold; text-align:center; border-right:1.5px solid #4c76b2; transition:background 0.2s;">Tus opciones</th>
                    <th style="background:#4c76b2; color:#fff; font-weight:bold; text-align:center; border-radius:0 8px 0 0; transition:background 0.2s;">Elegir habitaciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2" style="border-right:1.5px solid #4c76b2; background:#f8fafc;">
                        <div style="font-weight:bold; color:#4c76b2; font-size:1.1em;"> Habitación Doble Clásica <span style="margin-left:0.3em;"></div>
                        <div style="font-size:0.97em; color:#444; margin-bottom:0.5em;">2 camas individuales 🛏️🛏️</span> 
                        <div style="font-size:0.97em; color:#444; margin-bottom:0.5em;">Habitación amplia con vista al jardín. Aire acondicionado, caja fuerte, escritorio.</div>
                        <div style="margin-top:0.3em;">
                            <span title="Metros cuadrados">📏 25 m²</span>
                            <span title="Baño privado" style="margin-left:0.7em;">🛁 Baño privado</span>
                            <span title="TV" style="margin-left:0.7em;">📺 TV pantalla plana</span>
                            <span title="Desayuno" style="margin-left:0.7em;">🥐 Desayuno</span>
                            <span title="WiFi" style="margin-left:0.7em;">📶 Wifi gratis</span>
                        </div>
                    </td>
                    <td style="text-align:center; border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;"><span title="2 huéspedes">👤👤</span></td>
                    <td style="text-align:center; border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        $32.000
                        <br>
                        <span style="font-size:0.78em; color: #4c76b2; border-radius:5px; padding:1px 5px; margin-top:0.2em; display:inline-block;">+11% imp. <span title="Impuestos" style="cursor:pointer;">ℹ️</span></span>
                    </td>
                    <td style="border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        <div style="color:#176B4D; font-weight:bold; margin-bottom:0.3em;"><span style="margin-right:0.3em;">✔️</span>Desayuno Incluido</div>
                        <div style="color:#176B4D; font-weight:bold; margin-bottom:0.3em;"><span style="margin-right:0.3em;">✔️</span>Incluye estacionamiento</div>
                        <div style="color:#176B4D; font-weight:bold;"><span style="margin-right:0.3em;">✔️</span>Reembolsable</div>
                    </td>
                    <td style="text-align:center; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        <select style="padding:0.3em 0.7em; border-radius:6px; border:1px solid #ccc;">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="text-align:center; border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;"><span title="2 huéspedes">👤👤</span></td>
                    <td style="text-align:center; border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        $28.000
                        <br>
                        <span style="font-size:0.78em; color: #4c76b2; border-radius:5px; padding:1px 5px; margin-top:0.2em; display:inline-block;">+11% imp. <span title="Impuestos" style="cursor:pointer;">ℹ️</span></span>
                    </td>
                    <td style="border-right:1.5px solid #4c76b2; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        <div style="color:#B00020; font-weight:bold; margin-bottom:0.3em;"><span style="margin-right:0.3em;">⛔</span>Sin desayuno</div>
                        <div style="color:#176B4D; font-weight:bold; margin-bottom:0.3em;"><span style="margin-right:0.3em;">✔️</span>Incluye estacionamiento</div>
                        <div style="color:#B00020; font-weight:bold;"><span style="margin-right:0.3em;">⛔</span>No reembolsable</div>
                    </td>
                    <td style="text-align:center; border-top:1.5px solid #4c76b2; background:#f8fafc;">
                        <select style="padding:0.3em 0.7em; border-radius:6px; border:1px solid #ccc;">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <style>
            #tabla-disponibilidad th {
                cursor:pointer;
                transition:background 0.2s;
            }
            #tabla-disponibilidad th:hover {
                background:#138bb3 !important;
            }
            #tabla-disponibilidad td, #tabla-disponibilidad th {
                border-bottom:1.5px solid #4c76b2;
            }
            #tabla-disponibilidad tr:last-child td {
                border-bottom:none;
            }
        </style>
        `;

    } catch (error) {
        contenedor.innerHTML = '<p class="error">No se pudo cargar el detalle del alojamiento.</p>';
        console.error('Error al cargar detalle:', error);
    }
});