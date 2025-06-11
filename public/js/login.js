// frontend/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('login-error-message');
    const successMessageDiv = document.getElementById('login-success-message'); // Referencia al nuevo div
    const API_BASE_URL = 'http://localhost:3001/api';

    // Función helper para mostrar mensajes en la UI
    function mostrarMensajeUI(elemento, mensajeTexto, tipoClase) {
        if (elemento) {
            elemento.textContent = mensajeTexto;
            // Asegúrate de tener las clases .success-message y .error-message definidas en tu style.css
            // Estas clases deben manejar los colores de fondo, texto, bordes, etc.
            elemento.className = tipoClase; // Asigna la clase base (ej. 'error-message' o 'success-message')
            elemento.style.display = 'block';
        } else {
            // Fallback si el elemento no existe (no debería ocurrir con el HTML actualizado)
            console.warn(`Elemento para mensajes no encontrado. Fallback a alert: ${mensajeTexto}`);
            alert(mensajeTexto);
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ocultar mensajes previos
            if (errorMessageDiv) errorMessageDiv.style.display = 'none';
            if (successMessageDiv) successMessageDiv.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                mostrarMensajeUI(errorMessageDiv, 'Por favor, completa todos los campos.', 'error-message');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    if (data.usuario) {
                        sessionStorage.setItem('user', JSON.stringify(data.usuario));
                    }
                    
                    // Mostrar mensaje de éxito en el div
                    mostrarMensajeUI(successMessageDiv, 'Inicio de sesión exitoso. Redirigiendo...', 'success-message');
                    
                    
                    // Redirigir después de un breve momento para que el usuario vea el mensaje
                    setTimeout(() => {
                        window.location.href = '../index.html'; // Ajusta la URL de redirección si es necesario
                    }, 1000); // 1,3 segundos de espera

                } else {
                    mostrarMensajeUI(errorMessageDiv, data.message || `Error: ${response.status}`, 'error-message');
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
                mostrarMensajeUI(errorMessageDiv, 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.', 'error-message');
            }
        });
    }
});