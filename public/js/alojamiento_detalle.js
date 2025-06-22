document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'http://localhost:3001/api';
    const contenedor = document.getElementById('subdiv-content');
    const urlParams = new URLSearchParams(window.location.search);
    const alojamientoId = sessionStorage.getItem('alojamientoId');

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
        let tipoAlojamiento = sessionStorage.getItem('tipoAlojamiento');

        try {
            const resPuntajes = await fetch(`${API_BASE_URL}/puntajes/alojamiento/${alojamientoId}`);
            if (resPuntajes.ok) {
                puntajes = await resPuntajes.json();
                console.log('Puntajes obtenidos:', puntajes);
            }
        } catch (e) {
            puntajes = [];
        }
        
        // Renderizar lista de comentarios para la sección de comentarios
        const puntaje = puntajes[Math.floor(Math.random() * puntajes.length)];
        const comentarioHTML = puntaje
            ? `★ <b>${puntaje.puntuacion}</b> — ${puntaje.comentario}<br><b>${puntaje.nombre} ${puntaje.apellido}</b>`
            : 'Sin comentarios aún.';

        const textScore = alojamiento.promedio_puntaje >= 8.6 ? 'Excelente' : 
                            alojamiento.promedio_puntaje >= 7.6 ? 'Muy Bueno' : 
                            alojamiento.promedio_puntaje >= 6.6 ? 'Bueno' :
                            alojamiento.promedio_puntaje >= 5.6 ? 'Aceptable' :
                            'Regular';

        // Usar la primera como principal, el resto como galería
        const fotoPrincipal = imagenes[0]?.url_imagen || '';
        const galeria = imagenes.slice(1).map(img => img.url_imagen);

        // Agregar definición de fotos para la galería
        const fotos = [fotoPrincipal, ...galeria].filter(Boolean);
        while (fotos.length < 8) fotos.push(fotos[0] || '');

        document.getElementById('logo').addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        //variables de busqueda guardadas de huspedes y rooms
        document.getElementById('destinationSelect').value = sessionStorage.getItem('destination') || '';
        let AdultsInput = sessionStorage.getItem('adults');
        let ChildrenInput = sessionStorage.getItem('children');         
        let RoomsInput = sessionStorage.getItem('rooms');
        let checkinInput = document.getElementById('checkinInput');
        let checkoutInput = document.getElementById('checkoutInput');
        let modifCheckinInput = document.getElementById('modifCheckinInput');        
        let modifCheckoutInput = document.getElementById('modifCheckoutInput');

        // logica de calendario        
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        modifCheckinInput.min = today

        let checkinDate = new Date(sessionStorage.getItem('checkin'));
        checkinDate.setDate(checkinDate.getDate() + 1)
        let minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.min = minCheckout;
        modifCheckoutInput.min = minCheckout;

        checkinInput.addEventListener('change', () => {
            const checkinDate = new Date(checkinInput.value);

            if (!isNaN(checkinDate)) {
                // Activar el input de checkout
                checkoutInput.disabled = false;

                // Agregar 1 día
                checkinDate.setDate(checkinDate.getDate() + 1);

                // Formatear en YYYY-MM-DD
                const minCheckout = checkinDate.toISOString().split('T')[0];
                checkoutInput.min = minCheckout;
                modifCheckoutInput.min = minCheckout;
                console.log(checkoutInput)

                // (Opcional) Resetear valor si quedó anterior al nuevo mínimo
                if (checkoutInput.value < minCheckout) {
                checkoutInput.value = minCheckout;
                modifCheckoutInput.value = minCheckout;
                }
                sessionStorage.setItem('checkin', checkinInput.value)    
                sessionStorage.setItem('checkout', checkoutInput.value)
            } else {
                // Si se borra el valor de checkin, deshabilita checkout
                checkoutInput.disabled = true;
                checkoutInput.value = '';
            }
        });
        modifCheckinInput.addEventListener('change', () => {
            const modifCheckinDate = new Date(modifCheckinInput.value);

            if (!isNaN(modifCheckinDate)) {
                // Activar el input de checkout
                modifCheckoutInput.disabled = false;

                // Agregar 1 día
                modifCheckinDate.setDate(modifCheckinDate.getDate() + 1);

                // Formatear en YYYY-MM-DD
                const minCheckout = modifCheckinDate.toISOString().split('T')[0];
                modifCheckoutInput.min = minCheckout;
                checkoutInput.min = minCheckout;

                // (Opcional) Resetear valor si quedó anterior al nuevo mínimo
                if (modifCheckoutInput.value < minCheckout) {
                modifCheckoutInput.value = minCheckout;
                checkoutInput.value = minCheckout;
                }
                sessionStorage.setItem('checkin', modifCheckinInput.value)    
                sessionStorage.setItem('checkout', modifCheckoutInput.value)
            } else {
                // Si se borra el valor de checkin, deshabilita checkout
                modifCheckoutInput.disabled = true;
                modifCheckoutInput.value = '';
            }
        });
        document.querySelectorAll('.input-date-in').forEach( input => {
            input.addEventListener('change', () => {
                //console.log('date chaged', checkinInput.value);
                sessionStorage.setItem('checkin', input.value);
                checkinInput.value = input.value
                modifCheckinInput.value = input.value;
            });
        })
        document.querySelectorAll('.input-date-out').forEach( input => {
            input.addEventListener('change', () => {
                //console.log('date chaged', checkoutInput.value);
                sessionStorage.setItem('checkout', input.value);
                checkoutInput.value = input.value;
                modifCheckoutInput.value = input.value;
            });
        })

        // Breadcrumb
        let idTipoAloj = alojamiento.tipo_alojamiento_id;
        let inicio = document.getElementById('bc-inicio');
        let tipoAloj = document.getElementById('bc-tipo-aloj');
        let paisAloj = document.getElementById('bc-pais-aloj');
        let ciudadAloj = document.getElementById('bc-ciudad-aloj');
        let nombreAloj = document.getElementById('bc-nombre-aloj');
        tipoAloj.textContent = tipoAlojamiento;
        paisAloj.textContent = alojamiento.pais;
        ciudadAloj.textContent = alojamiento.ciudad;
        nombreAloj.textContent += alojamiento.nombre;        

        // Busqueda desde breadcrumb
        inicio.addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        let searchParams = {
            checkin: checkinInput.value,
            checkout: checkoutInput.value,
            adults: AdultsInput,
            children: ChildrenInput,
            rooms: RoomsInput
        };

        async function busquedaTabulada(queryString) {
            const response = await fetch(`http://localhost:3001/api/alojamientos?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            sessionStorage.setItem('storedSearchResults', JSON.stringify(data[0]));
            sessionStorage.removeItem('alojamientoId')
            sessionStorage.setItem('adults', AdultsInput);
            sessionStorage.setItem('children', ChildrenInput);
            sessionStorage.setItem('rooms', RoomsInput);
            sessionStorage.setItem('checkin', checkinInput.value);
            sessionStorage.setItem('checkout', checkoutInput.value);
            console.log('Alojamientos de este mismo tipo:', data[0]);
            console.log('queryString:', queryString);
            window.location.href = `../index.html`;
        }        
        tipoAloj.addEventListener('click', async () => {
            searchParams = {
                checkin: checkinInput.value,
                checkout: checkoutInput.value,
                adults: AdultsInput,
                children: ChildrenInput,
                rooms: RoomsInput
            };
            let queryString = new URLSearchParams({ 
                tipo_alojamiento: alojamiento.tipo_alojamiento,
                ...searchParams 
            }).toString();
            sessionStorage.setItem('tipoAlojamiento', tipoAlojamiento);
            sessionStorage.setItem('idTipoAlojamiento', alojamiento.tipo_alojamiento);
            sessionStorage.setItem('tipoBusqueda', 'tipoAlojamiento');
            busquedaTabulada(queryString);
        });
        paisAloj.addEventListener('click', async () => {
            searchParams = {
                checkin: checkinInput.value,
                checkout: checkoutInput.value,
                adults: AdultsInput,
                children: ChildrenInput,
                rooms: RoomsInput
            };
            let queryString = new URLSearchParams({ 
                pais: alojamiento.pais, 
                ...searchParams 
            }).toString();
            sessionStorage.setItem('alojamientoPais', alojamiento.pais);
            sessionStorage.setItem('tipoBusqueda', 'paisAlojamiento');
            busquedaTabulada(queryString);
        });
        ciudadAloj.addEventListener('click', async () => {
            searchParams = {
                checkin: checkinInput.value,
                checkout: checkoutInput.value,
                adults: AdultsInput,
                children: ChildrenInput,
                rooms: RoomsInput
            };
            let queryString = new URLSearchParams({ 
                destination: alojamiento.ciudad, 
                ...searchParams 
            }).toString();
            // let queryString = new URLSearchParams({
            //     ciudad: alojamiento.ciudad,
            //     checkin: checkinInput.value,
            //     checkout: checkoutInput.value,
            //     adults: AdultsInput,
            //     children: ChildrenInput,
            //     rooms: RoomsInput
            // }).toString();
            sessionStorage.setItem('destination', alojamiento.ciudad);
            sessionStorage.setItem('tipoBusqueda', 'ciudadAlojamiento');
            console.log('Ciudad de alojamiento:', ciudad, alojamiento.ciudad);
            console.log('alojamientos', alojamiento);
            busquedaTabulada(queryString);
        });

        const resServices = await fetch(`http://localhost:3001/api/caracteristicas/search/${alojamientoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!resServices.ok) {
            throw new Error('Error al obtener servicios');
        }
        const services = await resServices.json();
        console.log('servicios:', services);

        const resHabitaciones = await fetch(`http://localhost:3001/api/habitaciones/alojamiento/${alojamientoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const habitacionesTotales = await resHabitaciones.json();

       // Filtrar habiotaciones por disponibilidad
        const fechaCheckin = new Date(sessionStorage.getItem('checkin'));
        const fechaCheckout = new Date(sessionStorage.getItem('checkout'));
        sessionStorage.setItem('days', Math.ceil((new Date(fechaCheckout) - new Date(fechaCheckin)) / (1000 * 60 * 60 * 24)))
        
        let cantXTipo = {};
        let habitacionesDisponibles = [];

        habitacionesTotales.forEach(h => {
             cantXTipo[h.id_tipo_habitacion] = (cantXTipo[h.id_tipo_habitacion] || 0) + 1;
        });

        habitacionesTotales.forEach(h => {
            let estaDisponible = true;
            let habReservadas = 0;

            h.reservas.forEach( reserva => {
                const reservaCheckin = new Date(reserva.checkin);
                const reservaCheckout = new Date(reserva.checkout);

                console.log('fechaCheckin', fechaCheckin);
                console.log('fechaCheckout',fechaCheckout);       
                console.log('reservaCheckin',reservaCheckin)    
                console.log('reservaCheckout',reservaCheckout)

                if (
                    (fechaCheckin < reservaCheckout && fechaCheckout > reservaCheckin) ||
                    (fechaCheckin >= reservaCheckin && fechaCheckin < reservaCheckout) ||
                    (fechaCheckout > reservaCheckin && fechaCheckout <= reservaCheckout)
                ) {
                    estaDisponible = false;
                    //habReservadas = reserva.habitaciones;
                }
            });
            console.log('disponible', estaDisponible)
            if (estaDisponible) {
                habitacionesDisponibles.push(h);
            } else {
                cantXTipo[h.id_tipo_habitacion] -= 1; //habReservadas;
            }            
        });


        const habitaciones = [];
        const tiposContados = new Set();

        habitacionesDisponibles.forEach(h => {
            if (!tiposContados.has(h.id_tipo_habitacion)) {
                tiposContados.add(h.id_tipo_habitacion);
                habitaciones.push(h);
            }
        });

        console.log('habitaciones:', habitaciones);
        console.log('cantidades', cantXTipo)

        
        const tbHabitaciones = document.getElementById('tbody-habitaciones');
        tbHabitaciones.innerHTML = '';
        
        function crearOptions(cantidad) {
            let optSelect = ``;
            for (let i=0; i <= cantidad; i++) {
                optSelect += `<option value="${i}">${i}</option>`
                
            };
            return optSelect;
        };

        habitaciones.forEach((h, index) => {
            let caract = h.caracteristicas.map(c => `<span class="caracteristica-item">
                    <i class="fa-solid fa-${c.icono}"></i>${c.nombre}
                </span>`
            ).join('');


            console.log(cantXTipo[h.id_tipo_habitacion]);
            let optionsHTML = crearOptions(cantXTipo[h.id_tipo_habitacion])
                
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="especificaciones">
                    <div class="hab-name hab1">${h.tipo_habitacion_nombre}</div>
                    <div class="comodidades hab1">${h.camas_detalle} 🛏️🛏️</div> 
                    <div class="comodidades hab1">${h.tipo_habitacion_descripcion}</div>
                    <div class="comodidades-detalle hab1">                        
                        <span class="caracteristica-item" title="Metros cuadrados">📏 ${h.tamanio_m2} m&sup2</span>
                        ${caract}
                    </div>
                </td>
                <td class="cel-huespedes hab1"><span title="plazas">${'👤'.repeat(h.plazas)}</span></td>
                <td class="cel-costo hab1" id="cel-costo${index}">
                    $${h.precio * sessionStorage.getItem('rooms') * sessionStorage.getItem('days')}
                    <br>
                    <span class="task hab1">+11% imp. <span title="Impuestos" style="cursor:pointer;">ℹ️</span></span>
                </td>
                <td class="cel-opciones hab1">
                    <div class="opcion" ><span>✔️</span>Desayuno Incluido</div>
                    <div class="opcion"><span>✔️</span>Incluye estacionamiento</div>
                    <div class="opcion"><span>✔️</span>Reembolsable</div>
                </td>
                <td class="select-habitaciones hab${index}">
                    <select class="select-cant hab${index}" id="ix-tipo-hab${index}" 
                                                data-canthab='{"cant_hab":${sessionStorage.getItem('rooms')}}'
                                                onchange="actualizarDataReserva(this)">
                        ${optionsHTML}
                    </select>
                </td>
                <td class="reservar-ya" data-reserva='{"id-tipo":${h.id_tipo_habitacion}, 
                                                     "index-row":${index}}' id="res-hab${index}">Reserva ya!</td>
            `
            tbHabitaciones.appendChild(row);
            const select = row.querySelector('.select-cant');
            let roomsSel = parseInt(sessionStorage.getItem('rooms'));
            if (cantXTipo[h.id_tipo_habitacion] >= roomsSel)  {
                select.value = roomsSel; 
            } else {
                select.value = cantXTipo[h.id_tipo_habitacion]
                alert(`No hay ${roomsSel} habitaciones disponibles para todas las opciones de habitaciones`)
            }
        })

        document.querySelectorAll('td.reservar-ya').forEach((h, index) => {
            h.addEventListener('click', async() => {
                const dataReservaBtn = JSON.parse(h.dataset.reserva);
                const tipoHabitacion = dataReservaBtn["id-tipo"];
                const indexRow = dataReservaBtn["index-row"];
                const cantHabRes = document.getElementById(`ix-tipo-hab${indexRow}`);
                console.log('Tipo habitacion elegida', tipoHabitacion, cantHabRes.value);
                if (!sessionStorage.getItem('user')) {
                    console.log("LOGEARSE");
                    // const modalLogin = document.getElementById('loginModal');
                    // const closeLoginBtn = document.getElementById('closeModalBtnLogin');
                    const modalLogin = document.getElementById('loginModal');
                    modalLogin.style.display = 'grid';                    
                    return
                }
                modalLogin.style.display = 'none';
                let checkinRes = sessionStorage.getItem('checkin');
                let checkoutRes = sessionStorage.getItem('checkout');
                const user = JSON.parse(sessionStorage.getItem('user'));
                const resultReserva = await fetch('http://localhost:3001/api/reservas/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({                         
                        id_usuario: user['id_usuario'],
                        id_alojamiento: sessionStorage.getItem('alojamientoId'),
                        id_tipo_habitacion: tipoHabitacion, 
                        checkin: checkinRes, 
                        checkout: checkoutRes, 
                        adultos: Number(sessionStorage.getItem('adults')), 
                        menores: Number(sessionStorage.getItem('clildren')),
                        days: Math.ceil((new Date(checkoutRes) - new Date(checkinRes)) / (1000 * 60 * 60 * 24)),
                        estado : 'reservada',
                        cantidadBuscada: cantHabRes.value
                    })                    
                });
                const respuestaReserva = await resultReserva.json();
                console.log(respuestaReserva);
            });
        });

        document.querySelectorAll('.select-cant').forEach((option, index) => {
            option.addEventListener('change', () => {
                console.log('select change', option.value, index)
                const mensajeTask = `<br>
                    <span class="task hab1">+11% imp. <span title="Impuestos" style="cursor:pointer;">ℹ️</span></span>`
                let celCosto = document.getElementById(`cel-costo${index}`)
                celCosto.textContent = habitaciones[index].precio * option.value * sessionStorage.getItem('rooms');
                celCosto.innerHTML += mensajeTask
            })
        })

        // function actualizarDataReserva(selectElement) {
        //     const cantidadSeleccionada = selectElement.value;
        //     const dataCantHab = JSON.parse(selectElement.dataset.canthab);
            
        //     // Actualizamos la cantidad seleccionada
        //     dataCantHab.cant_hab = cantidadSeleccionada;
            
        //     // Guardamos el nuevo JSON en el atributo data-reserva
        //     selectElement.dataset.canthab = JSON.stringify(dataCantHab);
        // }
       


        

        // Galería y side info al mismo nivel y largo


        const galeriaYSideHTML = `
            <div id="galery">
                <div style="flex:3; min-width:0;">
                    <div class="galeria-fotos">
                        <img src="${fotos[0]}" alt="Foto principal">
                        <div>
                            <img src="${fotos[1]}" alt="">
                            <img src="${fotos[2]}" alt="">
                            <img src="${fotos[3]}" alt="">
                            <img src="${fotos[4]}" alt="">
                            <img src="${fotos[5]}" alt="">
                        </div>
                    </div>
                </div>
                <div class="cont-opinion">
                    <div class="box-puntuacion">
                        <div>${textScore}</div>
                        <div>${puntajePromedio}</div>
                    </div>
                    <div class="box-comentarios">
                        <span id="texto-placeholder" >
                            ${comentarioHTML }
                        </span>
                    </div>
                    <div id="cont-map">
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
            <button onclick="document.getElementById('disponibilidad').scrollIntoView({behavior:'smooth'});" 
                style="background:#16B0DA; color:#fff; border:none; border-radius:8px; padding:0.7em 2em; font-weight:bold; font-size:1em; cursor:pointer; margin-left:2em;">
                Reservar
            </button>
        `;

        // Render principal
        contenedor.innerHTML = `            
            <div class="hotel-card">
                <div id="name-address" style="">
                    <div id="name">
                        <span class="nombre">
                            ${alojamiento.nombre}
                        </span>
                        <span class="estrellas">${'★'.repeat(alojamiento.estrellas || 1)}</span>
                    </div>
                    <div class="direccion">
                        ${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}
                        <a href="https://maps.google.com/?q=${encodeURIComponent(`${alojamiento.direccion}, ${alojamiento.ciudad}, ${alojamiento.pais}`)}" target="_blank" style="font-weight:bold; color:#16B0DA; margin-left:0.7em; text-decoration:none; font-size:0.97em;">Mapa</a>
                    </div>
                </div>
                <div id="btn-like-comp" style="display:flex; align-items:center; gap:1em;">
                    <div class="icon" title="Like" style="cursor:pointer;"><i class="far fa-heart icon-heart"></i></div>
                    <a href="#" class="icon" title="Compartir" style="color:#16B0DA;"><i class="fa-solid fa-share-nodes icon-share"></i></a>
                    ${reservarBtn}
                </div>
            </div>

            ${galeriaYSideHTML}
            <h3 class="titulo-servicios" style="margin-top:2em;">Servicios</h3>
            <ul class="servicios-lista">
                ${(services).map(service =>
                        `<li class="servicio-item">${service.caracteristica_nombre}</li>`
                ).join('')}
            </ul>
            <section class="detalle-info" style="margin-top:2em;">
                <h2>Descripción</h2>
                <p>${alojamiento.descripcion || 'No disponible.'}</p>
                <hr style="margin:1.5em 0 0.5em 0; border:0; border-top:1.5px solid #e5e7eb;">
            </section>
            <h2 id="disponibilidad" style="margin-top:2.5em;">Disponibilidad</h2>
        `;

        document.getElementById('comentario-inferior').innerHTML = comentarioHTML

        checkinInput.value = sessionStorage.getItem('checkin');
        checkoutInput.value = sessionStorage.getItem('checkout');
        modifCheckinInput.value = sessionStorage.getItem('checkin');
        modifCheckoutInput.value = sessionStorage.getItem('checkout');
        //destinationInput.value = sessionStorage.getItem('destination');

        const guestsDisplayText = document.getElementById('guestsDisplay');
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

            sessionStorage.setItem('adults', AdultsInput)
            sessionStorage.setItem('children', ChildrenInput)
            sessionStorage.setItem('rooms', RoomsInput)
            console.log('save guest btn')
        
            // Update the display text
            guestsDisplay.textContent = `${AdultsInput} adultos, ${ChildrenInput} menores, ${RoomsInput} habitación${RoomsInput !== 1 ? 'es' : ''}`;
            modifGuestsDisplayText.textContent = `${AdultsInput} Adultos, ${ChildrenInput} Niños, ${RoomsInput} Habitaciones`;
            guestsModal.style.display = 'none'; 
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

const btnLogin = document.getElementById('nav-login');
const modalLogin = document.getElementById('loginModal');
const closeLoginBtn = document.getElementById('closeModalBtnLogin');
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    modalLogin.style.display = 'grid';
});
modalLogin.addEventListener('click', (event) => {
    if (event.target === modalLogin) {
        modalLogin.style.display = 'none';
    }
});
closeLoginBtn.addEventListener('click', () => {
    modalLogin.style.display = 'none'; 
});


document.getElementById('nav-logout').addEventListener('click', function (e) {
    e.preventDefault(); // Evita que navegue inmediatamente

    // Borra datos del localStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Redirige manualmente
    window.location.href = "../index.html";
});

// actualizar dataset del select.cantHab de fila seleccionada en tabla de disponibilidad
function actualizarDataReserva(selectElement) {
            const cantidadSeleccionada = selectElement.value;
            const dataCantHab = JSON.parse(selectElement.dataset.canthab);
            
            // Actualizamos la cantidad seleccionada
            dataCantHab.cant_hab = cantidadSeleccionada;
            
            // Guardamos el nuevo JSON en el atributo data-reserva
            selectElement.dataset.canthab = JSON.stringify(dataCantHab);
        }