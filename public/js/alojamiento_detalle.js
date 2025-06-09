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

        // Breadcrumb (ruta)
        const breadcrumbHTML = `
            <nav class="breadcrumb" style="background:#fff; border-radius:8px; padding:0.7em 1.2em; margin:1.5em 0;">
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
                    width="100%" height="120" style="border-radius:10px; border:0;"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </a>
        `;

        // Side info: calificación, comentario, mapa (más abajo, todos igual de ancho)
        const sideInfoHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1.2em; margin-top:2.5em; width:100%;">
            <div class="box-puntuacion" style="max-width:260px; width:100%; margin-bottom:0;">
                <div style="font-weight:bold; font-size:1.1em; margin-right:1em;">¡Muy bueno!</div>
                <div style="background:#16B0DA; color:#fff; border-radius:8px; padding:0.4em 1em; font-size:1.1em; font-weight:bold;">${alojamiento.promedio_puntaje || 8.7}</div>
            </div>
            <div class="box-comentarios" style="max-width:260px; width:100%; margin-bottom:0;">
                <span class="texto-placeholder" style="font-size:0.98em;">"Excelente atención y ubicación. Volvería sin dudar." <br><b>- Ejemplo de huésped</b></span>
            </div>
            <div style="max-width:260px; width:100%;">${mapaMini}</div>
        </div>
        `;

        // Render principal
        contenedor.innerHTML = `
            ${breadcrumbHTML}
            <div style="display:flex; gap:32px; align-items:flex-start; margin-bottom:2em;">
                <div style="flex:2; min-width:0;">
                    <div class="hotel-card" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1em;">
                        <div>
                            <div class="nombre" style="font-size:1.7em; font-weight:bold;">${alojamiento.nombre}</div>
                            <div style="display:flex; align-items:center; gap:0.7em; margin-top:0.2em;">
                                <div class="direccion" style="font-size:1.08em; color:#444;">
                                    ${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}
                                </div>
                                <a href="https://maps.google.com/?q=${mapQuery}" target="_blank" style="font-weight:bold; color:#16B0DA; margin-left:0.5em; text-decoration:none;">Mapa</a>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:1em;">
                            <div class="icon" title="Like" style="cursor:pointer;"><i class="far fa-heart icon-heart"></i></div>
                            <a href="#" class="icon" title="Compartir" style="color:#16B0DA;"><i class="fa-solid fa-share-nodes icon-share"></i></a>
                            <button class="btn-reservar" style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.6em 1.2em; font-weight:bold; cursor:pointer;">Reservar</button>
                        </div>
                    </div>
                    <div class="estrellas" style="font-size:1.2em; color:#FFD700; margin-bottom:1em;">${'★'.repeat(alojamiento.estrellas || 4)}</div>
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
                </div>
                <div style="flex:1; min-width:260px; align-self:stretch; display:flex;">
                    ${sideInfoHTML}
                </div>
            </div>
            <section class="reserva-section">
                <button class="btn btn-reservar-grande" id="btn-reservar-dinamico">¡Reservar Ahora!</button>
                <div id="form-reserva-detalle" class="form-reserva-popup" style="display:none;">
                    <h3>Completa tu Reserva para ${alojamiento.nombre}</h3>
                    <div>
                        <label for="fecha-inicio-detalle">Check-in:</label>
                        <input type="date" id="fecha-inicio-detalle" name="fecha-inicio">
                    </div>
                    <div>
                        <label for="fecha-fin-detalle">Check-out:</label>
                        <input type="date" id="fecha-fin-detalle" name="fecha-fin">
                    </div>
                    <div>
                        <button class="btn btn-confirmar-reserva" id="btn-confirmar-reserva">Confirmar Reserva</button>
                        <button class="btn btn-cancelar-popup" id="btn-cancelar-popup">Cancelar</button>
                    </div>
                    <div id="mensaje-form-detalle" style="margin-top:10px;"></div>
                </div>
            </section>
        `;

        // Mostrar/ocultar formulario de reserva
        const btnReservar = document.getElementById('btn-reservar-dinamico');
        const formReserva = document.getElementById('form-reserva-detalle');
        const btnCancelar = document.getElementById('btn-cancelar-popup');
        if(btnReservar && formReserva) {
            btnReservar.onclick = () => {
                formReserva.style.display = 'block';
                btnReservar.style.display = 'none';
            };
        }
        if(btnCancelar && formReserva && btnReservar) {
            btnCancelar.onclick = () => {
                formReserva.style.display = 'none';
                btnReservar.style.display = 'block';
            };
        }

        // Mensajes en el formulario
        function mostrarMensajeEnElemento(mensaje, tipo, elementoId) {
            const elementoMensaje = document.getElementById(elementoId);
            if (elementoMensaje) {
                elementoMensaje.textContent = mensaje;
                elementoMensaje.className = tipo === 'exito' ? 'mensaje-exito-popup' : 'mensaje-error-popup';
                elementoMensaje.style.display = 'block';
                if (tipo === 'exito') {
                    setTimeout(() => {
                        elementoMensaje.style.display = 'none';
                        elementoMensaje.textContent = '';
                    }, 7000);
                }
            } else {
                alert(mensaje);
            }
        }

        // Procesar reserva igual que en catalogo.js
        async function procesarReserva(alojamientoId, fechaInicioStr, fechaFinStr, mensajeElementoId) {
            const token = localStorage.getItem('token');
            if (!token) {
                mostrarMensajeEnElemento('Debes iniciar sesión para realizar una reserva. Redirigiendo a login...', 'error', mensajeElementoId);
                setTimeout(() => window.location.href = 'login.html', 3000);
                return false;
            }
            if (!fechaInicioStr || !fechaFinStr) {
                mostrarMensajeEnElemento('Debes seleccionar ambas fechas: Check-in y Check-out.', 'error', mensajeElementoId);
                return false;
            }
            const fechaInicio = new Date(fechaInicioStr + "T00:00:00");
            const fechaFin = new Date(fechaFinStr + "T00:00:00");
            const hoy = new Date();
            hoy.setHours(0,0,0,0);

            if (fechaInicio < hoy) {
                mostrarMensajeEnElemento('La fecha de Check-in no puede ser anterior a hoy.', 'error', mensajeElementoId);
                return false;
            }
            if (fechaFin <= fechaInicio) {
                mostrarMensajeEnElemento('La fecha de Check-out debe ser posterior a la fecha de Check-in.', 'error', mensajeElementoId);
                return false;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/reservas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        alojamiento_id: parseInt(alojamientoId),
                        fecha_inicio: fechaInicioStr,
                        fecha_fin: fechaFinStr
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    mostrarMensajeEnElemento(`¡Reserva creada exitosamente! ID: ${result.reserva.id}, Estado: ${result.reserva.estado}, Total: $${parseFloat(result.reserva.precio_total).toFixed(2)}`, 'exito', mensajeElementoId);
                    return true;
                } else {
                    mostrarMensajeEnElemento(`Error al crear reserva: ${result.message || response.statusText || 'Error desconocido del servidor'}`, 'error', mensajeElementoId);
                    return false;
                }
            } catch (error) {
                mostrarMensajeEnElemento('Ocurrió un error de red o conexión al procesar tu solicitud de reserva.', 'error', mensajeElementoId);
                return false;
            }
        }

        // Evento click de "Confirmar Reserva"
        const btnConfirmar = document.getElementById('btn-confirmar-reserva');
        if(btnConfirmar) {
            btnConfirmar.onclick = async () => {
                const fechaInicio = document.getElementById('fecha-inicio-detalle').value;
                const fechaFin = document.getElementById('fecha-fin-detalle').value;
                const mensajeDivId = 'mensaje-form-detalle';
                const exito = await procesarReserva(alojamientoId, fechaInicio, fechaFin, mensajeDivId);
                if (exito) {
                    setTimeout(() => {
                        document.getElementById('form-reserva-detalle').style.display = 'none';
                        document.getElementById('btn-reservar-dinamico').style.display = 'block';
                    }, 4000);
                }
            };
        }

    } catch (error) {
        contenedor.innerHTML = '<p class="error">No se pudo cargar el detalle del alojamiento.</p>';
        console.error('Error al cargar detalle:', error);
    }
});