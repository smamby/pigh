document.addEventListener('DOMContentLoaded', () => {
    const reservasListNode = document.getElementById('reservas-list');
    const mensajeReservasNode = document.getElementById('mensaje-reservas');
    const navNode = document.querySelector('header nav');

    const API_BASE_URL = '/api'; // Tu URL base
    const token = sessionStorage.getItem('token');

    function setupLogoutLink() {
        if (token && navNode) {
            // Eliminar enlaces de Login/Register si existen
            const loginLinkNav = navNode.querySelector('a[href="login.html"]');
            const registerLinkNav = navNode.querySelector('a[href="register.html"]');
            if (loginLinkNav) loginLinkNav.remove();
            if (registerLinkNav) registerLinkNav.remove();

            // Sacar "Mis Reservas" si no está (aunque ya estamos en esa página)
            if (navNode.querySelector('a[href="mis_reservas.html"]')) {
                navNode.querySelector('a[href="mis_reservas.html"]').style.display = 'none';
                //  const misReservasLink = document.createElement('a');
                //  misReservasLink.href = 'mis_reservas.html';
                //  misReservasLink.textContent = 'Mis Reservas';
                //  // Podrías insertarlo antes de otros, o al final
                //  const inicioLink = navNode.querySelector('a[href="index.html"]');
                //  if (inicioLink && inicioLink.nextSibling) {
                //     navNode.insertBefore(misReservasLink, inicioLink.nextSibling);
                //  } else {
                //     navNode.appendChild(misReservasLink);
                //  }
            }

            // Añadir "Cerrar Sesión" si no está
            if (!document.getElementById('nav-logout')) {
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Cerrar Sesión';
                logoutLink.id = 'nav-logout';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    window.location.href = '../index.html';
                });
                navNode.appendChild(logoutLink);
            }

        } else if (!token && navNode) {
            // Si no hay token, asegurar que Login/Registro estén y no "Mis Reservas" o "Logout"
            const misReservasLinkNav = navNode.querySelector('a[href="mis_reservas.html"]');
            const logoutLinkNav = document.getElementById('logout-link');
            if(misReservasLinkNav) misReservasLinkNav.remove();
            if(logoutLinkNav) logoutLinkNav.remove();

            if (!navNode.querySelector('a[href="login.html"]')) {
                const loginLink = document.createElement('a');
                loginLink.href = 'login.html';
                loginLink.textContent = 'Login';
                 const inicioLink = navNode.querySelector('a[href="index.html"]');
                 if (inicioLink && inicioLink.nextSibling) {
                    navNode.insertBefore(loginLink, inicioLink.nextSibling);
                 } else {
                    navNode.appendChild(loginLink);
                 }
            }
            if (!navNode.querySelector('a[href="register.html"]')) {
                const registerLink = document.createElement('a');
                registerLink.href = 'register.html';
                registerLink.textContent = 'Registro';
                const loginLinkAdded = navNode.querySelector('a[href="login.html"]');
                 if (loginLinkAdded && loginLinkAdded.nextSibling) {
                    navNode.insertBefore(registerLink, loginLinkAdded.nextSibling);
                 } else {
                    navNode.appendChild(registerLink);
                 }
            }
        }
    }

    setupLogoutLink();

    if (!token) {
        if (mensajeReservasNode) {
            mensajeReservasNode.textContent = 'Debes iniciar sesión para ver tus reservas.';
            mensajeReservasNode.style.display = 'block';
            if(reservasListNode) reservasListNode.innerHTML = ''; // Limpiar "Cargando..."
        }
        // Opcional: redirigir a login después de un momento
        setTimeout(() => { window.location.href = '../index.html'; }, 3000);
        return;
    }

    document.getElementById('nav-logout').addEventListener('click', function (e) {
        e.preventDefault(); // Evita que navegue inmediatamente

        // Borra datos del
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // Redirige manualmente
        window.location.href = "../index.html";
    });
    document.getElementById('logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../index.html';
    })

    async function fetchMisReservas() {
        if (mensajeReservasNode) {
            mensajeReservasNode.textContent = 'Cargando tus reservas...'; // Asegurar mensaje de carga
            mensajeReservasNode.style.display = 'block';
        }
        try {
            // AJUSTE: Usar la ruta de tu backend '/reservas/mis-reservas'
            const response = await fetch(`${API_BASE_URL}/reservas/mis-reservas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                if (mensajeReservasNode) mensajeReservasNode.textContent = 'Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.';
                setTimeout(() => { window.location.href = 'login.html'; }, 3000);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al cargar tus reservas.' }));
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const reservas = await response.json();

            console.log("reservas:",reservas)

            if (reservasListNode && mensajeReservasNode) {
                reservasListNode.innerHTML = ''; // Limpiar contenido previo (incluido "Cargando...")

                if (reservas.length === 0) {
                    mensajeReservasNode.textContent = 'Aún no tienes ninguna reserva.';
                    mensajeReservasNode.style.display = 'block';
                    return;
                }

                mensajeReservasNode.style.display = 'none'; // Ocultar mensajes si hay reservas

                reservas.forEach(reserva => {
                    const reservaCard = document.createElement('div');
                    reservaCard.className = 'reserva-card';

                    // AJUSTE: Usar los nombres de campo de tu backend
                    // Tu backend devuelve: nombre_alojamiento, fecha_inicio, fecha_fin, precio_total, estado
                    const fechaDesde = new Date(reserva.checkin).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                    const fechaHasta = new Date(reserva.checkout).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                    const days = Math.ceil((new Date(reserva.checkout) - new Date(reserva.checkin)) / (1000 * 60 * 60 * 24));
                    const precioPorNoche = parseFloat(reserva.precio) || 0;
                    const precioTotal = reserva.cantidad_habitaciones * days * precioPorNoche;
                    console.log('precio', precioTotal, days);
                    reservaCard.innerHTML = `

                        <div class="reserva-header">
                            <h3 class="reserva-titulo">${reserva.nombre_alojamiento}</h3>
                            <span class="reserva-estado ${reserva.estado.toLowerCase()}">${reserva.estado}</span>
                        </div>

                        <div class="reserva-body">
                            <div class="reserva-ubicacion">
                                <i class="fas fa-map-marker-alt"></i>
                                <span class="reserva-ciudad">${reserva.ciudad || 'N/D'}</span>,
                                <span class="reserva-pais">${reserva.pais || 'N/D'}</span>
                            </div>

                            <div class="reserva-fechas">
                                <div class="fecha-item">
                                    <i class="far fa-calendar-check"></i>
                                    <span class="fecha-label">Desde:</span>
                                    <span class="fecha-valor">${fechaDesde}</span>
                                </div>
                                <div class="fecha-item">
                                    <i class="far fa-calendar-times"></i>
                                    <span class="fecha-label">Hasta:</span>
                                    <span class="fecha-valor">${fechaHasta}</span>
                                </div>
                            </div>

                            <div class="reserva-habitaciones">
                                <div class="habitacion-item">
                                    <i class="fas fa-door-open"></i>
                                    <span class="habitacion-label">Habitaciones:</span>
                                    <span class="habitacion-valor">${reserva.cantidad_habitaciones} (${reserva.numeros_habitaciones})</span>
                                </div>
                                <div class="habitacion-item">
                                    <i class="fas fa-moon"></i>
                                    <span class="habitacion-label">Noches:</span>
                                    <span class="habitacion-valor">${days}</span>
                                </div>
                            </div>

                            <div class="reserva-precio">
                                <i class="fas fa-tag"></i>
                                <span class="precio-label">Precio total:</span>
                                <span class="precio-valor">$${parseFloat(precioTotal).toFixed(2)}</span>
                            </div>
                        </div>

                        <div class="reserva-footer">
                            <small class="reserva-id">ID Reserva: ${reserva.ids_reservas}</small>

                        </div>

                    `;
                    reservasListNode.appendChild(reservaCard);
                });
            }


        } catch (error) {
            console.error('Error fetching reservas:', error);
            if (mensajeReservasNode) {
                mensajeReservasNode.textContent = `Error al cargar tus reservas: ${error.message}`;
                mensajeReservasNode.style.display = 'block';
                if(reservasListNode) reservasListNode.innerHTML = '';
            }
        }
    }

    fetchMisReservas();
});