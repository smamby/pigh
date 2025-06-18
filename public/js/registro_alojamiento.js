document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA PARA AÑADIR/QUITAR TIPOS DE HABITACIÓN ---
    const addRoomBtn = document.getElementById('add-room-type-btn');
    const roomContainer = document.getElementById('room-types-container');
    const roomTemplate = document.getElementById('room-type-template');
    let roomCounter = 0;

    // Datos iniciales de las habitaciones para el hotel de ejemplo (ID 1)
    // En una aplicación real, estos datos se cargarían desde tu backend.
    const initialRoomData = [
        { nombre: 'Habitación Estándar Doble', capacidad_adultos: 2, capacidad_menores: 0, precio_base: 80.00, cantidad_total: 1, descripcion: 'Habitación física 101. Vista al patio interior, piso bajo.' },
        { nombre: 'Habitación Deluxe King', capacidad_adultos: 2, capacidad_menores: 1, precio_base: 120.00, cantidad_total: 1, descripcion: 'Habitación física 201. Vista a la calle, cama king size.' }
    ];

    // Función para añadir un nuevo bloque de tipo de habitación, con datos opcionales para pre-rellenar
    function addRoomType(data = null) {
        const clone = roomTemplate.content.cloneNode(true);
        const roomItem = clone.querySelector('.room-type-item');
        
        // Asignar names únicos a los inputs usando el contador
        const inputs = roomItem.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const name = input.getAttribute('name');
            if (name) {
                input.name = `habitaciones[${roomCounter}][${name}]`;
                // Si hay datos, rellenar el campo
                if (data && data[name]) {
                    input.value = data[name];
                }
            }
        });
        
        if (data) {
            roomItem.querySelector('h3').textContent = "Habitación Existente";
        }

        roomContainer.appendChild(roomItem);
        roomCounter++;
    }

    // Cargar las habitaciones existentes al cargar la página
    function populateInitialRooms() {
        initialRoomData.forEach(roomData => addRoomType(roomData));
    }
    populateInitialRooms(); 

    // Event listener para el botón de añadir (añade un bloque vacío)
    addRoomBtn.addEventListener('click', () => addRoomType());

    // Event listener para quitar un bloque (delegación de eventos)
    roomContainer.addEventListener('click', function (e) {
        if (e.target.closest('.remove-room-type-btn')) {
            e.target.closest('.room-type-item').remove();
        }
    });

    // --- LÓGICA PARA LA CARGA DE IMÁGENES (DRAG & DROP Y PREVIEW) ---
    const dragArea = document.getElementById('drag-area');
    const fileInput = document.getElementById('imagenes_alojamiento');
    const previewContainer = document.getElementById('preview-container');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => dragArea.addEventListener(eventName, () => dragArea.classList.add('active'), false));
    ['dragleave', 'drop'].forEach(eventName => dragArea.addEventListener(eventName, () => dragArea.classList.remove('active'), false));

    dragArea.addEventListener('drop', e => {
        // Asignar los archivos arrastrados al input de tipo file
        fileInput.files = e.dataTransfer.files;
        handleFiles(fileInput.files);
    }, false);

    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        // Limpiar el contenedor de previsualización antes de añadir nuevas imágenes
        previewContainer.innerHTML = '';
        if (files.length === 0) return;

        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith('image/')) return; // Asegurarse de que sea una imagen

            const reader = new FileReader();
            reader.onload = function(e) {
                const previewWrapper = document.createElement('div');
                previewWrapper.className = 'relative group'; // Contenedor para la imagen y el botón de principal

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'h-32 w-full object-cover rounded-md';
                
                // Botón/radio para marcar como imagen principal
                const principalLabel = document.createElement('label');
                // Si es la primera imagen, marcarla como principal por defecto
                if (index === 0) {
                    principalLabel.className = 'absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer'; // Color diferente para la seleccionada
                    principalLabel.innerHTML = `<input type="radio" name="es_principal_nueva" value="${file.name}" class="sr-only" checked> Principal`;
                } else {
                    principalLabel.className = 'absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer';
                    principalLabel.innerHTML = `<input type="radio" name="es_principal_nueva" value="${file.name}" class="sr-only"> Principal`;
                }

                // Añadir evento para cambiar el estilo al seleccionar el radio
                principalLabel.querySelector('input[type="radio"]').addEventListener('change', function() {
                    // Remover la clase 'bg-blue-600' de todos los labels y añadir 'bg-blue-500'
                    document.querySelectorAll('#preview-container label').forEach(lbl => {
                        lbl.classList.remove('bg-blue-600');
                        lbl.classList.add('bg-blue-500');
                    });
                    // Añadir 'bg-blue-600' al label del radio seleccionado
                    if (this.checked) {
                        principalLabel.classList.remove('bg-blue-500');
                        principalLabel.classList.add('bg-blue-600');
                    }
                });

                previewWrapper.appendChild(img);
                previewWrapper.appendChild(principalLabel);
                previewContainer.appendChild(previewWrapper);
            }
            reader.readAsDataURL(file); // Leer el archivo como una URL de datos para la previsualización
        });
    }
});