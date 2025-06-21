document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    let searchResultsGrid = document.getElementById('searchResultsGrid');


    // --- 0) Renderizar busqueda recurente desde alojamiento ---
    if (sessionStorage.getItem('storedSearchResults')) {
        let checkin = sessionStorage.getItem('checkin');
        let checkout = sessionStorage.getItem('checkout');
        document.getElementById('checkin').value = checkin;
        document.getElementById('checkout').value = checkout;
        document.getElementById('checkout').disabled = false;

        if (sessionStorage.getItem('tipoBusqueda') === 'ciudadAlojamiento') {
            document.getElementById('destinationSelect').value = sessionStorage.getItem('destination');
        }
        let accommodations = JSON.parse(sessionStorage.getItem('storedSearchResults'));

        const busqueda = document.querySelector('.search-results-section');
        const browser = document.querySelector('.browse-section');
        busqueda.style.display = 'block'; // Mostrar la sección de resultados
        browser.style.display = 'none'; // Ocultar la sección de exploración
        
        const estadoBusqueda = document.querySelector('.hero-background');
        const container = document.querySelector('.container.hero-content');
        const searchForm = document.querySelector('.search-form-container');
        estadoBusqueda.classList.add('busqueda');
        container.classList.add('busqueda');
        searchForm.classList.add('busqueda');
        searchForm.classList.remove('achicar');
        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        const unHotelPorId = new Map();
        accommodations.forEach(hotel => {
            if (!unHotelPorId.has(hotel.id_alojamiento)) {
                unHotelPorId.set(hotel.id_alojamiento, hotel);
            }
        });
        const hotelesUnicos = Array.from(unHotelPorId.values());
        console.log('Cargando resultados de búsqueda desde sessionStorage', 
                    hotelesUnicos);
        let adults = sessionStorage.getItem('adults');
        let children = sessionStorage.getItem('children');
        let rooms = sessionStorage.getItem('rooms');
        let days = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        renderSearchResults(hotelesUnicos, adults, children, rooms, days);
        sessionStorage.removeItem('storedSearchResults');
    } 

    // --- 1) Sumit del buscador ---
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const destination = document.getElementById('destinationSelect').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adults = parseInt(document.getElementById('adultsInput').value) || 1;
        const children = parseInt(document.getElementById('childrenInput').value) || 0;
        const rooms = parseInt(document.getElementById('roomsInput').value) || 1;
    
        // Basic validation
        if (!destination || !checkin || !checkout) {
            alert('Por favor, completa todos los campos de búsqueda.');
            return;
        }

        const searchParams = {
            destination,
            checkin,
            checkout,
            adults,
            children,
            rooms
        };

        const queryString = new URLSearchParams(searchParams).toString();
        console.log('Parámetros de búsqueda:', queryString);

        try {
            const response = await fetch(`http://localhost:3001/api/alojamientos?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json(); 
            console.log('Response data:', data);
            const busqueda = document.querySelector('.search-results-section');
            const browser = document.querySelector('.browse-section');
            busqueda.style.display = 'block'; // Show the search results section
            browser.style.display = 'none'; // Hide the browse section
            console.log('data/acommodations', data);
            const accommodations = data[0]; // Assuming the API returns an array of accommodations
            const estadoBusqueda = document.querySelector('.hero-background');
            const container = document.querySelector('.container.hero-content');
            const searchForm = document.querySelector('.search-form-container');
            estadoBusqueda.classList.add('busqueda');
            container.classList.add('busqueda');
            searchForm.classList.add('busqueda');
            searchForm.classList.remove('achicar');
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            const days = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));

            const unHotelPorId = new Map();

            accommodations.forEach(hotel => {
                if (!unHotelPorId.has(hotel.id_alojamiento)) {
                    unHotelPorId.set(hotel.id_alojamiento, hotel);
                }
            });

            const hotelesUnicos = Array.from(unHotelPorId.values());

            console.log('hotelesUnicos:', hotelesUnicos);

            renderSearchResults(hotelesUnicos, adults, children, rooms, days);

            window.scrollTo({
            top: 0,
            behavior: "smooth"
            });

        } catch (error) {
            console.error('Error searching accommodations:', error);
            // Render mock data even if API call fails
            
            //renderSearchResults(mockAccommodations);
        }
    });
});


function renderSearchResults(results, adults, children, rooms, days) {
    searchResultsGrid.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsGrid.innerHTML = '<p style="text-align: center; width: 100%;">No se encontraron alojamientos para tu búsqueda.</p>';
        return;
    }
    console.log('results:', results);

    results.forEach(async alojamiento => {
        const card = document.createElement('div');
        card.classList.add('card');
        const IDtipoAlojam = alojamiento.id_tipo_alojamiento;
        const IdAlojamiento = alojamiento.id_alojamiento;
        const totalPrice = alojamiento.precio * days * rooms;
        const textScore = alojamiento.promedio_puntaje >= 8.6 ? 'Excelente' : 
                            alojamiento.promedio_puntaje >= 7.6 ? 'Muy Bueno' : 
                            alojamiento.promedio_puntaje >= 6.6 ? 'Bueno' :
                            alojamiento.promedio_puntaje >= 5.6 ? 'Aceptable' :
                            'Regular';

        const resIdTipo = await fetch(`http://localhost:3001/api/tipo_alojamientos/${IDtipoAlojam}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        });
        const tipoAlojamiento = await resIdTipo.json();
        console.log('[[Response data]]:', tipoAlojamiento.nombre, IDtipoAlojam);

        const resImgAloj = await fetch(`http://localhost:3001/api/img_alojamientos/${IdAlojamiento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        });
        const imgAlojamiento = await resImgAloj.json();
        console.log('Response data img aloj:', imgAlojamiento);
        console.log('Response data img aloj URL:', imgAlojamiento[0].url_imagen);

        const resServices = await fetch(`http://localhost:3001/api/caracteristicas/search/${IdAlojamiento}`, {
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

        card.dataset.idAlojamiento = IdAlojamiento;
        // Render the accommodation card
            card.innerHTML =`
            <div class="accommodation-card">
                        <div class="accommodation-card__image">
                            <img src="${imgAlojamiento[0].url_imagen}" alt="${alojamiento.nombre}">
                        </div>
                        <div class="accommodation-cont-data">
                            <div class="accommodation-card__details">
                                <h3 class="accommodation-card__title">${alojamiento.nombre_aloj}</h3>
                                <h4 class="accommodation-card__subtitle">${alojamiento.tipo_habitacion_nombre}</h4>
                                <div class="accommodation-card__stars">
                                    ${'<i class="fas fa-star"></i>'.repeat(alojamiento.estrellas)}
                                </div>
                                <p class="accommodation-card__location">${alojamiento.ciudad}, ${alojamiento.pais}</p>
                                <div class="accommodation-card__amenities">
                                    ${services.map(service => 
                                        `<span class="amenity-tag">${service.caracteristica_nombre}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            <div class="accommodation-card__pricing-rating">
                                <div class="rating-box">
                                    <span class="rating-text">${textScore}</span>
                                    <span class="rating-score">${alojamiento.promedio_puntaje}</span>
                                </div>
                                <div class="price-info">
                                    <span class="price">$ ${totalPrice}</span>
                                    <span class="guests-info">Adultos ${adults}, menores ${children}</span>
                                    <span class="guests-info">Habitaciones: ${rooms} por ${days} días</span>
                                </div>
                                <div class="reservar-button">
                                    <a href="/pages/alojamiento.html?id=${IdAlojamiento}" class="btn btn-primary">Reservar</a>
                                </div>
                            </div>                        
                        </div>
                    </div>
            `;
        searchResultsGrid.appendChild(card);
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                //const idAlojamiento = card.getAttribute('data-id');
                const id = card.dataset.idAlojamiento;
                console.log('Click en card, ID:', id);
                sessionStorage.removeItem('tipoBusqueda');
                sessionStorage.setItem('alojamientoId', id);
                sessionStorage.setItem('adults', adults);
                sessionStorage.setItem('children', children);   
                sessionStorage.setItem('rooms', rooms);
                sessionStorage.setItem('days', days);
                sessionStorage.setItem('checkin', document.getElementById('checkin').value);
                sessionStorage.setItem('checkout', document.getElementById('checkout').value);
                sessionStorage.setItem('destination', document.getElementById('destinationSelect').value);
                sessionStorage.setItem('tipoAlojamiento', tipoAlojamiento.nombre);
                sessionStorage.setItem('idTipoAlojamiento', alojamiento.id_tipo_alojamiento);
                console.log('debugging', id, adults, children, rooms, days, 
                    alojamiento.id_tipo_alojamiento, tipoAlojamiento.nombre, 
                    alojamiento.ciudad, alojamiento.pais);
                window.location.href = `/pages/alojamiento.html?id=${id}`;
            });
        })

    });
}


// Logica de calendarios para checkin checkout
// Establecer mínimo para hoy
const today = new Date().toISOString().split('T')[0];
checkin.min = today;

checkin.addEventListener('change', () => {
const checkinDate = new Date(checkin.value);

    if (!isNaN(checkinDate)) {
        // Activar el input de checkout
        checkout.disabled = false;

        // Agregar 1 día
        checkinDate.setDate(checkinDate.getDate() + 1);

        // Formatear en YYYY-MM-DD
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkout.min = minCheckout;

        // (Opcional) Resetear valor si quedó anterior al nuevo mínimo
        if (checkout.value < minCheckout) {
        checkout.value = minCheckout;
        }
    } else {
        // Si se borra el valor de checkin, deshabilita checkout
        checkout.disabled = true;
        checkout.value = '';
    }
});

// busquedas con cards tipo alojamiento
const tipoHotel = document.getElementById('card-hotel');
const tipoApartamento = document.getElementById('card-apartamento');
const tipoResort = document.getElementById('card-resort');
const tipoVillas = document.getElementById('card-villas');




// scroll para achicar hero y browse section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-background');
    const browseSection = document.querySelector('.browse-section');
    const moduloBuscador = document.querySelector('.search-form-container');

    const scrollY = window.scrollY;
    const screenHeight = window.innerHeight;
    console.log(scrollY);

    // Si se ha hecho scroll de al menos el 10% de la pantalla
    if (scrollY > screenHeight * 0.1 && !moduloBuscador.classList.contains('busqueda')) {
        hero.classList.add('achicarse');
        browseSection.classList.add('achicar');
        moduloBuscador.classList.add('achicar');
    } else {
        hero.classList.remove('achicarse');
        browseSection.classList.remove('achicar');
        moduloBuscador.classList.remove('achicar');
    }
    // let hasSnapped = false;
    // if (scrollY < screenHeight * 0.04  && !hasSnapped) {
    //     hasSnapped = true;
    //     window.scrollTo({
    //     top: 0,
    //     behavior: "smooth"
    //     });
    // }
    // // Evita múltiples disparos
    // setTimeout(() => {
    // hasSnapped = false;
    // }, 500);
});

const destinationSelect = document.getElementById('destinationSelect');
const datalist = document.getElementById('ciudad');
let lastQuery = '';
let optID = '';

// --- 1) Cargar destinos dinámicamente ---
destinationSelect.addEventListener('input', async () => {
    console.log('prueba event listener input')
    const query = destinationSelect.value.trim();
    console.log('query:', query);
    if (query.length < 2) {
        datalist.classList.remove('expandido'); // Hide the datalist
        return;
    }
    if (query.length < 2 || query === lastQuery) return;
    lastQuery = query;
    try {
        const response = await fetch(`http://localhost:3001/api/alojamientos/destinos?ciudad=${query}`);
        const destinations = await response.json(); // Assuming the API returns JSON
        console.log('Destinos [search]:', destinations);

        datalist.innerHTML = ''; // Clear existing options
        datalist.classList.add('expandido'); // Show the datalist
        destinations.slice(0, 5).forEach(destination => {
            const option = document.createElement('div');
            option.value = destination;
            option.textContent = destination;
            option.className = 'opt-ciudad';
            option.id =   `ciudad-${destination}`;
            datalist.appendChild(option);
            
            option.addEventListener('click', () => {
                console.log('click en ciudadInput', option.value);
                datalist.classList.remove('expandido'); // Hide the datalist
                destinationSelect.value = option.value;
                destinationSelect.focus();
            });
        });
    } catch (error) {
        console.error('Error loading destinations:', error);
        // Fallback to default options if API fails
        const defaultDestinations = ['Buenos Aires', 'Córdoba', 'Mendoza', 'Bariloche', 'Salta'];
        destinationSelect.innerHTML = '';
    }
});





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
    modalAdultsInput.value = adultsHiddenInput.value;
    modalChildrenInput.value = childrenHiddenInput.value;
    modalRoomsInput.value = roomsHiddenInput.value;
    guestsModal.style.display = 'flex'; // Show the modal
});

closeModalBtn.addEventListener('click', () => {
    guestsModal.style.display = 'none'; // Hide the modal
});

saveGuestsBtn.addEventListener('click', () => {
    const adults = parseInt(modalAdultsInput.value);
    const children = parseInt(modalChildrenInput.value);
    const rooms = parseInt(modalRoomsInput.value);

    // Update hidden inputs
    adultsHiddenInput.value = adults;
    childrenHiddenInput.value = children;
    roomsHiddenInput.value = rooms;

    // Update the display text
    guestsDisplay.textContent = `${adults} adultos, ${children} menores, ${rooms} habitación${rooms !== 1 ? 'es' : ''}`;
    guestsModal.style.display = 'none'; // Hide the modal
});

// Close modal if clicking outside
guestsModal.addEventListener('click', (event) => {
    if (event.target === guestsModal) {
        guestsModal.style.display = 'none';
    }
});