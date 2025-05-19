document.addEventListener('DOMContentLoaded', () => {
    const reservasListNode = document.getElementById('reservas-list');
    const mensajeReservasNode = document.getElementById('mensaje-reservas');
    const navNode = document.querySelector('header nav');

    const API_BASE_URL = 'http://localhost:3001/api'; // Tu URL base
    const token = localStorage.getItem('token');

    function setupLogoutLink() {
        if (token && navNode) {
            // Eliminar enlaces de Login/Register si existen
            const loginLinkNav = navNode.querySelector('a[href="login.html"]');
            const registerLinkNav = navNode.querySelector('a[href="register.html"]');
            if (loginLinkNav) loginLinkNav.remove();
            if (registerLinkNav) registerLinkNav.remove();

            // Añadir "Mis Reservas" si no está (aunque ya estamos en esa página)
            if (!navNode.querySelector('a[href="mis_reservas.html"]')) {
                 const misReservasLink = document.createElement('a');
                 misReservasLink.href = 'mis_reservas.html';
                 misReservasLink.textContent = 'Mis Reservas';
                 // Podrías insertarlo antes de otros, o al final
                 const inicioLink = navNode.querySelector('a[href="index.html"]');
                 if (inicioLink && inicioLink.nextSibling) {
                    navNode.insertBefore(misReservasLink, inicioLink.nextSibling);
                 } else {
                    navNode.appendChild(misReservasLink);
                 }
            }
            
            // Añadir "Cerrar Sesión" si no está
            if (!document.getElementById('logout-link')) {
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.textContent = 'Cerrar Sesión';
                logoutLink.id = 'logout-link';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
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
        // setTimeout(() => { window.location.href = 'login.html'; }, 3000);
        return; 
    }

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
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (mensajeReservasNode) mensajeReservasNode.textContent = 'Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.';
                setTimeout(() => { window.location.href = 'login.html'; }, 3000);
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error al cargar tus reservas.' }));
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const reservas = await response.json();

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
                    const fechaDesde = new Date(reserva.fecha_inicio).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                    const fechaHasta = new Date(reserva.fecha_fin).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

                    reservaCard.innerHTML = `
                        <h3>${reserva.nombre_alojamiento}</h3> 
                        <p><strong>Ciudad:</strong> ${reserva.ciudad || 'N/D'}</p>
                        <p><strong>País:</strong> ${reserva.pais || 'N/D'}</p>
                        <p><strong>Desde:</strong> ${fechaDesde}</p>
                        <p><strong>Hasta:</strong> ${fechaHasta}</p>
                        <p><strong>Precio Total:</strong> $${parseFloat(reserva.precio_total).toFixed(2)}</p>
                        <p><strong>Estado:</strong> ${reserva.estado}</p>
                        <p><small>ID Reserva: ${reserva.id}</small></p>
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