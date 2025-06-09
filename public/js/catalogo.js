// public/js/catalogo.js

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navMisReservas = document.getElementById('nav-mis-reservas');
    const navLogout = document.getElementById('nav-logout');

    if (token) {
        if (navLogin) navLogin.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
        if (navMisReservas) navMisReservas.style.display = 'inline'; // o 'block'
        if (navLogout) {
            navLogout.style.display = 'inline'; // o 'block'
            navLogout.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/index.html'; // O a login.html
            });
        }
    } else {
        if (navLogin) navLogin.style.display = 'inline';
        if (navRegister) navRegister.style.display = 'inline';
        if (navMisReservas) navMisReservas.style.display = 'none';
        if (navLogout) navLogout.style.display = 'none';
    }


    const alojamientosContainer = document.getElementById('alojamientos-container');
    const alojamientoIndividualContainer = document.getElementById('alojamiento-individual-container');
    const filtroCiudadInput = document.getElementById('filtro-ciudad');
    const filtroPaisInput = document.getElementById('filtro-pais');
    const filtroTipoInput = document.getElementById('filtro-tipo');
    const aplicarFiltrosButton = document.getElementById('aplicar-filtros');

    const API_BASE_URL = 'http://localhost:3001/api';

    function getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Muestra un mensaje en un elemento específico de la página.
     * @param {string} mensaje - El texto del mensaje a mostrar.
     * @param {string} tipo - 'exito' o 'error' para aplicar clases CSS.
     * @param {string} elementoId - El ID del elemento donde se mostrará el mensaje.
     */
    function mostrarMensajeEnElemento(mensaje, tipo, elementoId) {
        const elementoMensaje = document.getElementById(elementoId);
        if (elementoMensaje) {
            elementoMensaje.textContent = mensaje;
            // Usamos clases específicas para popups para no colisionar con .error global
            elementoMensaje.className = tipo === 'exito' ? 'mensaje-exito-popup' : 'mensaje-error-popup';
            elementoMensaje.style.display = 'block';
            
            // Ocultar mensajes de éxito después de un tiempo
            if (tipo === 'exito') {
                 setTimeout(() => {
                    if (elementoMensaje) { // Verificar si aún existe
                        elementoMensaje.style.display = 'none';
                        elementoMensaje.textContent = '';
                    }
                }, 7000);
            }
            // Los mensajes de error permanecen hasta nueva acción o cierre manual (no implementado)
        } else {
            console.warn(`Elemento para mensajes con ID '${elementoId}' no encontrado. Fallback a alert.`);
            alert(mensaje); 
        }
    }
    
    /**
     * Procesa la solicitud de reserva.
     * @returns {Promise<boolean>} true si la reserva fue exitosa, false en caso contrario.
     */
    async function procesarReserva(alojamientoId, fechaInicioStr, fechaFinStr, mensajeElementoId) {
        const token = getToken();
        if (!token) {
            mostrarMensajeEnElemento('Debes iniciar sesión para realizar una reserva. Redirigiendo a login...', 'error', mensajeElementoId);
            setTimeout(() => window.location.href = 'login.html', 3000);
            return false;
        }

        if (!fechaInicioStr || !fechaFinStr) {
            mostrarMensajeEnElemento('Debes seleccionar ambas fechas: Check-in y Check-out.', 'error', mensajeElementoId);
            return false;
        }
        const fechaInicio = new Date(fechaInicioStr + "T00:00:00"); // Asegurar que se interprete como local
        const fechaFin = new Date(fechaFinStr + "T00:00:00");     // Asegurar que se interprete como local
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
            console.error('Error en la solicitud de reserva:', error);
            mostrarMensajeEnElemento('Ocurrió un error de red o conexión al procesar tu solicitud de reserva.', 'error', mensajeElementoId);
            return false;
        }
    }

    async function fetchAlojamientos(filtros = {}) {
        try {
            const queryParams = new URLSearchParams(filtros).toString();
            const response = await fetch(`${API_BASE_URL}/alojamientos?${queryParams}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener alojamientos:', error);
            if (alojamientosContainer) {
                alojamientosContainer.innerHTML = '<p class="error">No se pudieron cargar los alojamientos. Intente más tarde.</p>';
            }
            return [];
        }
    }

    // function renderAlojamientos(alojamientos) {
    //     if (!alojamientosContainer) return;
    //     alojamientosContainer.innerHTML = ''; 

    //     if (!alojamientos || alojamientos.length === 0) {
    //         alojamientosContainer.innerHTML = '<p>No se encontraron alojamientos con los criterios seleccionados.</p>';
    //         return;
    //     }

    //     alojamientos.forEach(alojamiento => {
    //         const card = document.createElement('div');
    //         card.classList.add('alojamiento-card');
    //         card.innerHTML = `
    //             <h3>${alojamiento.nombre_aloj}</h3>
    //             <p><strong>Tipo:</strong> ${alojamiento.tipo_alojamiento}</p>
    //             <p><strong>Ubicación:</strong> ${alojamiento.ciudad}, ${alojamiento.pais}</p>
    //             <p><strong>Capacidad:</strong> ${alojamiento.capacidad} personas</p>
    //             <p><strong>Precio por noche:</strong> $${parseFloat(alojamiento.precio).toFixed(2)}</p>
    //             <p class="${alojamiento.disponible ? 'disponible' : 'no-disponible'}">
    //                 ${alojamiento.disponible ? 'Disponible' : 'No Disponible'}
    //             </p>
    //             <div class="acciones-card">
    //                 <a href="alojamiento.html?id=${alojamiento.id}" class="btn btn-ver-detalles">Ver Detalles</a>
    //                 ${alojamiento.disponible ? `<button class="btn btn-reservar" data-id="${alojamiento.id}">Reservar</button>` : ''}
                    
    //                 <div id="form-reserva-tarjeta-${alojamiento.id}" class="form-reserva-popup" style="display:none;">
    //                     <h4>Reservar: ${alojamiento.nombre}</h4>
    //                     <div>
    //                         <label for="fecha-inicio-tarjeta-${alojamiento.id}">Check-in:</label>
    //                         <input type="date" id="fecha-inicio-tarjeta-${alojamiento.id}" name="fecha-inicio">
    //                     </div>
    //                     <div>
    //                         <label for="fecha-fin-tarjeta-${alojamiento.id}">Check-out:</label>
    //                         <input type="date" id="fecha-fin-tarjeta-${alojamiento.id}" name="fecha-fin">
    //                     </div>
    //                     <div>
    //                         <button class="btn btn-confirmar-reserva" data-alojamiento-id="${alojamiento.id}">Confirmar Reserva</button>
    //                         <button class="btn btn-cancelar-popup" data-form-id="form-reserva-tarjeta-${alojamiento.id}">Cancelar</button>
    //                     </div>
    //                     <div id="mensaje-form-tarjeta-${alojamiento.id}" style="margin-top:10px;"></div>
    //                 </div>
    //             </div>
    //         `;
            
    //         const btnReservar = card.querySelector('.btn-reservar');
    //         const formPopup = card.querySelector(`#form-reserva-tarjeta-${alojamiento.id}`);
    //         const mensajeElementoPopup = card.querySelector(`#mensaje-form-tarjeta-${alojamiento.id}`);

    //         if (btnReservar && formPopup) {
    //             btnReservar.addEventListener('click', () => {
    //                 // Ocultar otros popups abiertos antes de mostrar este
    //                 document.querySelectorAll('.form-reserva-popup').forEach(popup => {
    //                     if (popup.id !== formPopup.id) popup.style.display = 'none';
    //                 });
    //                 formPopup.style.display = formPopup.style.display === 'none' ? 'block' : 'none';
    //                 if (mensajeElementoPopup) { 
    //                     mensajeElementoPopup.style.display = 'none';
    //                     mensajeElementoPopup.textContent = '';
    //                 }
    //                 // Limpiar inputs de fecha al abrir
    //                 card.querySelector(`#fecha-inicio-tarjeta-${alojamiento.id}`).value = '';
    //                 card.querySelector(`#fecha-fin-tarjeta-${alojamiento.id}`).value = '';
    //             });
    //         }

    //         const btnConfirmarReserva = card.querySelector('.btn-confirmar-reserva');
    //         if (btnConfirmarReserva) {
    //             btnConfirmarReserva.addEventListener('click', async () => {
    //                 const alojamientoId = btnConfirmarReserva.dataset.alojamientoId;
    //                 const fechaInicio = card.querySelector(`#fecha-inicio-tarjeta-${alojamientoId}`).value;
    //                 const fechaFin = card.querySelector(`#fecha-fin-tarjeta-${alojamientoId}`).value;
    //                 const mensajeId = `mensaje-form-tarjeta-${alojamientoId}`;
                    
    //                 const exito = await procesarReserva(alojamientoId, fechaInicio, fechaFin, mensajeId);
    //                 if (exito && formPopup) {
    //                      setTimeout(() => formPopup.style.display = 'none', 4000); 
    //                 }
    //             });
    //         }
            
    //         const btnCancelarPopup = card.querySelector('.btn-cancelar-popup');
    //         if (btnCancelarPopup && formPopup) {
    //             btnCancelarPopup.addEventListener('click', () => {
    //                 formPopup.style.display = 'none';
    //                 if (mensajeElementoPopup) {
    //                     mensajeElementoPopup.style.display = 'none';
    //                     mensajeElementoPopup.textContent = '';
    //                 }
    //             });
    //         }
    //         alojamientosContainer.appendChild(card);
    //     });
    // }

async function fetchAndRenderAlojamientoIndividual() {
    if (!alojamientoIndividualContainer) return;
    const urlParams = new URLSearchParams(window.location.search);
    const alojamientoIdParam = urlParams.get('id');
    if (!alojamientoIdParam) {
        alojamientoIndividualContainer.innerHTML = '<p class="error">No se especificó un ID de alojamiento.</p>';
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/alojamientos/${alojamientoIdParam}`);
        if (!response.ok) throw new Error('Alojamiento no encontrado');
        const alojamiento = await response.json();

        // Traer imagen principal
        const resImgAloj = await fetch(`${API_BASE_URL}/img_alojamientos/${alojamientoIdParam}`);
        const imgAlojamiento = await resImgAloj.json();
        alojamiento.foto_principal = imgAlojamiento[0]?.url_imagen || '';

        renderAlojamientoIndividual(alojamiento);
    } catch (error) {
        alojamientoIndividualContainer.innerHTML = '<p class="error">No se pudo cargar el detalle del alojamiento.</p>';
    }
}
    

function renderAlojamientoIndividual(alojamiento) {
    if (!alojamientoIndividualContainer) return;

    alojamientoIndividualContainer.innerHTML = `
        <article class="alojamiento-detalle-individual">
            <h2>${alojamiento.nombre_aloj}</h2>
            ${alojamiento.foto_principal ? `<img src="${alojamiento.foto_principal}" alt="Foto de ${alojamiento.nombre}" class="foto-principal-detalle">` : ''}
            <p><strong>Descripción:</strong> ${alojamiento.descripcion || 'No disponible.'}</p>
            <p><strong>Dirección:</strong> ${alojamiento.direccion || 'No disponible.'}</p>
            <p><strong>Ubicación:</strong> ${alojamiento.ciudad}, ${alojamiento.pais}</p>
            <p><strong>Tipo:</strong> ${alojamiento.tipo_habitacion_nombre}</p>
            <p><strong>Capacidad:</strong> ${alojamiento.capacidad} personas</p>
            <p><strong>Precio por noche:</strong> $${parseFloat(alojamiento.precio).toFixed(2)}</p>
            <p><strong>Latitud:</strong> ${alojamiento.latitud || 'No disponible'}</p>
            <p><strong>Longitud:</strong> ${alojamiento.longitud || 'No disponible'}</p>
            ${alojamiento.servicios && alojamiento.servicios.length ? `
                <div>
                    <strong>Servicios:</strong>
                    <ul class="servicios-lista">
                        ${alojamiento.servicios.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${alojamiento.fotos && alojamiento.fotos.length ? `
                <div class="galeria-fotos">
                    ${alojamiento.fotos.map(f => `<img src="${f}" alt="Foto adicional" class="foto-galeria">`).join('')}
                </div>
            ` : ''}
            <p class="${alojamiento.disponible ? 'disponible' : 'no-disponible'}">
                <strong>${alojamiento.disponible ? 'Disponible para reservar' : 'Actualmente No Disponible'}</strong>
            </p>
            ${alojamiento.disponible ? `<button class="btn btn-reservar-grande" data-id="${alojamiento.id}">¡Reservar Ahora!</button>` : ''}
            <div id="form-reserva-detalle-${alojamiento.id}" class="form-reserva-popup" style="display:none;">
                <h3>Completa tu Reserva para ${alojamiento.nombre}</h3>
                <div>
                    <label for="fecha-inicio-detalle-${alojamiento.id}">Check-in:</label>
                    <input type="date" id="fecha-inicio-detalle-${alojamiento.id}" name="fecha-inicio">
                </div>
                <div>
                    <label for="fecha-fin-detalle-${alojamiento.id}">Check-out:</label>
                    <input type="date" id="fecha-fin-detalle-${alojamiento.id}" name="fecha-fin">
                </div>
                <div>
                    <button class="btn btn-confirmar-reserva" data-alojamiento-id="${alojamiento.id}">Confirmar Reserva</button>
                    <button class="btn btn-cancelar-popup">Cancelar</button>
                </div>
                <div id="mensaje-form-detalle-${alojamiento.id}" style="margin-top:10px;"></div>
            </div>
            <br/>
            <a href="index.html" class="btn btn-volver">Volver al catálogo</a>
        </article>
    `;

        const btnReservarGrande = alojamientoIndividualContainer.querySelector('.btn-reservar-grande');
        const formPopupDetalle = alojamientoIndividualContainer.querySelector(`#form-reserva-detalle-${alojamiento.id}`);
        const mensajeElementoDetallePopup = alojamientoIndividualContainer.querySelector(`#mensaje-form-detalle-${alojamiento.id}`);

        if (btnReservarGrande && formPopupDetalle) {
            btnReservarGrande.addEventListener('click', () => {
                formPopupDetalle.style.display = 'block';
                btnReservarGrande.style.display = 'none'; // Ocultar botón principal
                if (mensajeElementoDetallePopup) {
                    mensajeElementoDetallePopup.style.display = 'none';
                    mensajeElementoDetallePopup.textContent = '';
                }
                 // Limpiar inputs de fecha al abrir
                alojamientoIndividualContainer.querySelector(`#fecha-inicio-detalle-${alojamiento.id}`).value = '';
                alojamientoIndividualContainer.querySelector(`#fecha-fin-detalle-${alojamiento.id}`).value = '';
            });
        }

        const btnConfirmarReservaDetalle = formPopupDetalle ? formPopupDetalle.querySelector('.btn-confirmar-reserva') : null;
        if (btnConfirmarReservaDetalle) {
            btnConfirmarReservaDetalle.addEventListener('click', async () => {
                const alojamientoId = btnConfirmarReservaDetalle.dataset.alojamientoId;
                const fechaInicio = alojamientoIndividualContainer.querySelector(`#fecha-inicio-detalle-${alojamientoId}`).value;
                const fechaFin = alojamientoIndividualContainer.querySelector(`#fecha-fin-detalle-${alojamientoId}`).value;
                const mensajeId = `mensaje-form-detalle-${alojamientoId}`;
                
                const exito = await procesarReserva(alojamientoId, fechaInicio, fechaFin, mensajeId);
                if (exito && formPopupDetalle && btnReservarGrande) {
                     setTimeout(() => {
                        formPopupDetalle.style.display = 'none';
                        btnReservarGrande.style.display = 'block'; // Re-mostrar botón principal
                    }, 4000);
                }
            });
        }
        
        const btnCancelarPopupDetalle = formPopupDetalle ? formPopupDetalle.querySelector('.btn-cancelar-popup') : null;
        if(btnCancelarPopupDetalle && formPopupDetalle && btnReservarGrande) {
            btnCancelarPopupDetalle.addEventListener('click', () => {
                formPopupDetalle.style.display = 'none';
                btnReservarGrande.style.display = 'block'; // Mostrar botón principal de nuevo
                if (mensajeElementoDetallePopup) {
                    mensajeElementoDetallePopup.style.display = 'none';
                    mensajeElementoDetallePopup.textContent = '';
                }
            });
        }
    }

    if (alojamientosContainer) {
        fetchAlojamientos().then(renderAlojamientos).catch(error => {
            console.error("Error inicial al cargar alojamientos para el catálogo:", error.message);
        });

        if (aplicarFiltrosButton) {
            aplicarFiltrosButton.addEventListener('click', () => {
                const filtros = {};
                if (filtroCiudadInput.value) filtros.ciudad = filtroCiudadInput.value.trim();
                if (filtroPaisInput.value) filtros.pais = filtroPaisInput.value.trim();
                if (filtroTipoInput.value) filtros.tipo_alojamiento = filtroTipoInput.value.trim();
                
                fetchAlojamientos(filtros).then(renderAlojamientos).catch(error => {
                    console.error("Error al cargar alojamientos filtrados:", error.message);
                     if (alojamientosContainer) {
                        alojamientosContainer.innerHTML = '<p class="error">No se pudieron cargar los alojamientos con los filtros aplicados. Intente más tarde.</p>';
                    }
                });
            });
        }
    }

    if (alojamientoIndividualContainer) {
        fetchAndRenderAlojamientoIndividual().catch(error => {
            console.error("Error inicial al cargar el detalle del alojamiento:", error.message);
        });
    }

});