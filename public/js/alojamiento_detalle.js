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

        // Traer puntajes y comentarios dinámicos
        let puntajes = [];
        let puntajePromedio = alojamiento.promedio_puntaje;
        let tipoAlojamiento = sessionStorage.getItem('tipoAlojamiento') || 'Hoteles';

        try {
            const resPuntajes = await fetch(`${API_BASE_URL}/puntajes/alojamiento/${alojamientoId}`);
            if (resPuntajes.ok) {
                puntajes = await resPuntajes.json();
            }
        } catch (e) {
            puntajes = [];
        }

        // // Calcular promedio dinámico si hay puntajes
        // const promedio = puntajes.length
        //     ? (puntajes.reduce((acc, p) => acc + parseFloat(p.puntuacion), 0) / puntajes.length).toFixed(1)
        //     : (alojamiento.promedio_puntaje || 8.7);

        // Comentario destacado (el más reciente con comentario)
        const comentarioDestacado = puntajes.find(p => p.comentario && p.comentario.trim());

        // Renderizar lista de comentarios para la sección de comentarios
        const comentariosHTML = puntajes.length
            ? puntajes
                .filter(p => p.comentario && p.comentario.trim())
                .map(p => `<div class="comentario-item" style="margin-bottom:1em;"><b>★ ${p.puntuacion}</b> — ${p.comentario}</div>`)
                .join('')
            : '<span class="texto-placeholder" style="font-size:0.92em;">Sin comentarios aún.</span>';

        // Usar la primera como principal, el resto como galería
        const fotoPrincipal = imagenes[0]?.url_imagen || '';
        const galeria = imagenes.slice(1).map(img => img.url_imagen);

        // Agregar definición de fotos para la galería
        const fotos = [fotoPrincipal, ...galeria].filter(Boolean);
        while (fotos.length < 8) fotos.push(fotos[0] || '');

        // Breadcrumb (ruta) - sin fondo blanco
        const breadcrumbHTML = `
            <nav class="breadcrumb" style="border-radius:8px; padding:0.7em 1.2em; margin:1.5em 0;">
                <span style="font-weight:bold; color: #16B0DA;">Inicio</span>
                <span class="breadcrumb-separator"></span>
                <span style="font-weight:bold; color:#16B0DA;">${tipoAlojamiento}</span>
                <span class="breadcrumb-separator"></span>
                <span style="font-weight:bold; color:#16B0DA;">${alojamiento.pais}</span>
                <span class="breadcrumb-separator"></span>
                <span style="font-weight:bold; color:#16B0DA;">${alojamiento.ciudad}</span>
                <span class="breadcrumb-separator"></span>
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
        <input id="checkinInput" type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div>
        <label style="font-weight:bold;">Check out</label><br>
        <input id="checkoutInput" type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div class="form-group">
        <label for="guestsDisplay">Huéspedes</label>
        <div id="guestsDisplay" class="custom-select">2 Adultos, 0 Niños, 1 Habitaciones</div>
        <input type="hidden" id="adultsInput" value="2">
        <input type="hidden" id="childrenInput" value="0">
        <input type="hidden" id="roomsInput" value="1">
        </div>
        <button style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer;">Buscar</button>
        </div>
        `;

// Galería y side info al mismo nivel y largo
const galeriaYSideHTML = `
<div style="display:flex; gap:32px; align-items:stretch; margin-bottom:2em;">
    <div style="flex:3; min-width:0;">
        <div class="galeria-fotos" style="display:flex; flex-direction:column; gap:12px;">
            <img src="${fotos[0]}" alt="Foto principal" style="width:100%; height:300px; object-fit:cover; border-radius:14px;">
            <div style="display:flex; gap:10px; width:100%;">
                <img src="${fotos[1]}" alt="" style="flex:1; height:80px; object-fit:cover; border-radius:8px;">
                <img src="${fotos[2]}" alt="" style="flex:1; height:80px; object-fit:cover; border-radius:8px;">
                <img src="${fotos[3]}" alt="" style="flex:1; height:80px; object-fit:cover; border-radius:8px;">
                <img src="${fotos[4]}" alt="" style="flex:1; height:80px; object-fit:cover; border-radius:8px;">
                <img src="${fotos[5]}" alt="" style="flex:1; height:80px; object-fit:cover; border-radius:8px;">
            </div>
        </div>
    </div>
    <div style="flex:1; min-width:220px; max-width:320px; display:flex; flex-direction:column; gap:14px; justify-content:flex-start;">
        <div class="box-puntuacion" style="width:100%; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:14px; background:#f3f4f6; box-shadow:0 2px 8px #0001;">
            <div style="font-weight:bold; font-size:1em; color:#176B4D; margin-bottom:0.2em;">¡Muy bueno!</div>
            <div style="color:#fff; background:#16B0DA; border-radius:8px; padding:0.2em 0.7em; font-size:1.15em; font-weight:bold;">${puntajePromedio}</div>
        </div>
        <div class="box-comentarios" style="width:100%; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:14px; background:#f3f4f6; box-shadow:0 2px 8px #0001;">
            <span class="texto-placeholder" style="font-size:0.92em; text-align:center; line-height:1.1;">
                ${comentarioDestacado ? `"${comentarioDestacado.comentario}"<br><b>- ${comentarioDestacado.nombre || 'Cliente'}</b>` : 'Sin comentarios'}
            </span>
        </div>
        <div style="width:100%; height:300px; border-radius:14px; background:#f3f4f6; box-shadow:0 2px 8px #0001; overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <a href="https://maps.google.com/?q=${encodeURIComponent(`${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}`)}" target="_blank" style="display:block; width:100%; height:100%;">
                <iframe
                    src="https://maps.google.com/maps?q=${encodeURIComponent(`${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}`)}&z=15&output=embed"
                    width="100%" height="100%" style="border-radius:10px; border:0;"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </a>
        </div>
    </div>
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
                                <a href="https://maps.google.com/?q=${encodeURIComponent(`${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}`)}" target="_blank" style="font-weight:bold; color:#16B0DA; margin-left:0.7em; text-decoration:none; font-size:0.97em;">Mapa</a>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:1em;">
                            <div class="icon" title="Like" style="cursor:pointer;"><i class="far fa-heart icon-heart"></i></div>
                            <a href="#" class="icon" title="Compartir" style="color:#16B0DA;"><i class="fa-solid fa-share-nodes icon-share"></i></a>
                            ${reservarBtn}
                        </div>
                    </div>
                    ${galeriaYSideHTML}
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
                            <input id="modifCheckinInput" type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
                        </div>
                        <div>
                            <label style="font-weight:bold;">Check out</label><br>
                            <input id="modifCheckoutInput" type="date" style="padding:0.5em; border-radius:6px; border:1px solid #ccc;">
                        </div>
                        <div class="form-group">
                            <label for="guestsDisplay">Huéspedes</label>
                            <div id="modifGuestsDisplay" class="custom-select">2 Adultos, 0 Niños, 1 Habitaciones</div>
                            <input type="hidden" id="modifAdultsInput" value="2">
                            <input type="hidden" id="modifChildrenInput" value="0">
                            <input type="hidden" id="modifRoomsInput" value="1">
                        </div>                        
                        <button style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer;">Modificar búsqueda</button>
                    </div>
                    <div id="tabla-disponibilidad"></div>
                    <h2 style="margin-top:2.5em;">Comentarios de los clientes</h2>
                    <div style="background:#f3f4f6; border-radius:14px; border:1.5px solid #4c76b2; padding:1.2em 1.5em; margin-bottom:2em;">
                        ${comentariosHTML}
                    </div>
                    <h2 style="margin-top:2.5em;">Normas de la Casa</h2>
                    <div style="background:#f3f4f6; border-radius:14px; border:1.5px solid #4c76b2; padding:1.2em 1.5em; margin-bottom:2em;">
                        <span style="font-weight:bold; font-size:0.98em;">Detalle de las Normas de la Casa (horarios check in y check out, horario desayuno, parking, etc)</span>
                    </div>
                </div>
            </div>
        `;

        // Render tabla de disponibilidad con formato y estilos
        document.getElementById('tabla-disponibilidad').innerHTML = `
        <table class="tabla-habitaciones">
            <thead>
                <tr>
                    <th class="th0" rowspan="2">Tipo de Habitación</th>
                    <th class="th1">Cant. Huéspedes</th>
                    <th class="th1">Precio por 2 noches</th>
                    <th class="th1">Tus opciones</th>
                    <th class="th2">Elegir habitaciones</th>
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
        `;

        const checkinInput = document.getElementById('checkinInput');
        const checkoutInput = document.getElementById('checkoutInput');
        const modifCheckinInput = document.getElementById('modifCheckinInput');
        const modifCheckoutInput = document.getElementById('modifCheckoutInput');
        checkinInput.value = sessionStorage.getItem('checkin');
        checkoutInput.value = sessionStorage.getItem('checkout');
        modifCheckinInput.value = sessionStorage.getItem('checkin');
        modifCheckoutInput.value = sessionStorage.getItem('checkout');
        //destinationInput.value = sessionStorage.getItem('destination');

        const guestsDisplayText = document.getElementById('guestsDisplay');
        let AdultsInput = sessionStorage.getItem('adults');
        let ChildrenInput = sessionStorage.getItem('children');         
        let RoomsInput = sessionStorage.getItem('rooms');
        guestsDisplayText.textContent = `${AdultsInput} Adultos, ${ChildrenInput} Niños, ${RoomsInput} Habitaciones`;
        const modifGuestsDisplayText = document.getElementById('modifGuestsDisplay');
        const modifAdultsInput = sessionStorage.getItem('adults'); 
        const modifChildrenInput = sessionStorage.getItem('children'); 
        const modifRoomsInput = sessionStorage.getItem('rooms'); 
        modifGuestsDisplayText.textContent = `${modifAdultsInput} Adultos, ${modifChildrenInput} Niños, ${modifRoomsInput} Habitaciones`;
        
        //  Lógica del popup de Huéspedes ---
        const guestsDisplay = document.getElementById('guestsDisplay');
        const guestsModal = document.getElementById('guestsModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const saveGuestsBtn = document.getElementById('saveGuestsBtn');
        const modalAdultsInput = document.getElementById('modalAdults');
        const modalChildrenInput = document.getElementById('modalChildren');
        const modalRoomsInput = document.getElementById('modalRooms');
        const adultsHiddenInput = document.getElementById('adultsInput');
        const childrenHiddenInput = document.getElementById('childrenInput');
        const roomsHiddenInput = document.getElementById('roomsInput');
        
        guestsDisplay.addEventListener('click', () => {
            // Set modal inputs to current hidden input values
            modalAdultsInput.value = AdultsInput;
            modalChildrenInput.value = ChildrenInput;
            modalRoomsInput.value = RoomsInput;
            guestsModal.style.display = 'flex'; // Show the modal
        });
        modifGuestsDisplayText.addEventListener('click', () => {
            // Set modal inputs to current hidden input values
            modalAdultsInput.value = AdultsInput;
            modalChildrenInput.value = ChildrenInput;
            modalRoomsInput.value = RoomsInput;
            guestsModal.style.display = 'flex'; // Show the modal
        });
        
        closeModalBtn.addEventListener('click', () => {
            guestsModal.style.display = 'none'; // Hide the modal
        });
        
        saveGuestsBtn.addEventListener('click', () => {
            AdultsInput = parseInt(modalAdultsInput.value);
            ChildrenInput = parseInt(modalChildrenInput.value);
            RoomsInput = parseInt(modalRoomsInput.value);
        
            // Update hidden inputs
            adultsHiddenInput.value = AdultsInput;
            childrenHiddenInput.value = ChildrenInput;
            roomsHiddenInput.value = RoomsInput;
        
            // Update the display text
            guestsDisplay.textContent = `${AdultsInput} adultos, ${ChildrenInput} menores, ${RoomsInput} habitación${RoomsInput !== 1 ? 'es' : ''}`;
            modifGuestsDisplayText.textContent = `${AdultsInput} Adultos, ${ChildrenInput} Niños, ${RoomsInput} Habitaciones`;
            guestsModal.style.display = 'none'; // Hide the modal
        });
        
        // Close modal if clicking outside
        guestsModal.addEventListener('click', (event) => {
            if (event.target === guestsModal) {
                guestsModal.style.display = 'none';
            }
        });

    } catch (error) {
        contenedor.innerHTML = '<p class="error">No se pudo cargar el detalle del alojamiento.</p>';
        console.error('Error al cargar detalle:', error);
    }
    
});
