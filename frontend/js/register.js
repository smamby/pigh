// frontend/js/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('register-error-message');
    const successMessageDiv = document.getElementById('register-success-message');
    // Definir API_BASE_URL aquí también
    const API_BASE_URL = 'http://localhost:3001/api';

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(errorMessageDiv) {
                errorMessageDiv.style.display = 'none';
                errorMessageDiv.textContent = '';
            }
            if(successMessageDiv) {
                successMessageDiv.style.display = 'none';
                successMessageDiv.textContent = '';
            }

            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!nombre || !apellido || !email || !password || !confirmPassword) {
                if(errorMessageDiv) {
                    errorMessageDiv.textContent = 'Por favor, completa todos los campos.';
                    errorMessageDiv.style.display = 'block';
                } else {
                    alert('Por favor, completa todos los campos.');
                }
                return;
            }

            if (password !== confirmPassword) {
                if(errorMessageDiv) {
                    errorMessageDiv.textContent = 'Las contraseñas no coinciden.';
                    errorMessageDiv.style.display = 'block';
                } else {
                    alert('Las contraseñas no coinciden.');
                }
                return;
            }

            if (password.length < 6) { // Asumiendo una longitud mínima de 6
                if(errorMessageDiv) {
                    errorMessageDiv.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                    errorMessageDiv.style.display = 'block';
                } else {
                    alert('La contraseña debe tener al menos 6 caracteres.');
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, apellido, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    if(successMessageDiv) {
                        successMessageDiv.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
                        successMessageDiv.style.display = 'block';
                    } else {
                        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    }
                    registerForm.reset(); // Limpiar el formulario
                    
                    // Opcionalmente, redirigir a login después de unos segundos
                    setTimeout(() => {
                        // Asumiendo que login.html está en el mismo directorio /pages/
                        window.location.href = 'login.html';
                    }, 3000); // Redirige después de 3 segundos

                } else {
                    if(errorMessageDiv) {
                        errorMessageDiv.textContent = data.message || `Error: ${response.status}`;
                        errorMessageDiv.style.display = 'block';
                    } else {
                        alert(data.message || `Error: ${response.status}`);
                    }
                }
            } catch (error) {
                console.error('Error en el registro:', error);
                if(errorMessageDiv) {
                    errorMessageDiv.textContent = 'Ocurrió un error al intentar registrarte. Inténtalo de nuevo.';
                    errorMessageDiv.style.display = 'block';
                } else {
                    alert('Ocurrió un error al intentar registrarte. Inténtalo de nuevo.');
                }
            }
        });
    }
});