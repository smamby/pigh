document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchResultsGrid = document.getElementById('searchResultsGrid');

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
            const data = await response.json(); // Assuming the API returns JSON
            console.log('Response data:', data);
            const busqueda = document.querySelector('.search-results-section');
            const browser = document.querySelector('.browse-section');
            busqueda.style.display = 'block'; // Show the search results section
            browser.style.display = 'none'; // Hide the browse section
            console.log('data/acommodations', data);
            const accommodations = data; // Assuming the API returns an array of accommodations
            const estadoBusqueda = document.querySelector('.hero-background');
            const container = document.querySelector('.container.hero-content');
            estadoBusqueda.classList.add('busqueda');
            container.classList.add('busqueda');
            window.scrollTo({
            top: 0,
            behavior: "smooth"
            });

            renderSearchResults(accommodations);

        } catch (error) {
            console.error('Error searching accommodations:', error);
            // Render mock data even if API call fails
            
            //renderSearchResults(mockAccommodations);
        }
    });
});


function renderSearchResults(results) {
    searchResultsGrid.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsGrid.innerHTML = '<p style="text-align: center; width: 100%;">No se encontraron alojamientos para tu búsqueda.</p>';
        return;
    }
    console.log('results:', results);
    results.forEach(accommodation => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${accommodation.imageUrl}" alt="${accommodation.name}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${accommodation.name}</h3>
                <p>${accommodation.destination}</p>
                <p>Precio por noche: $${accommodation.price}</p>
                <p>${accommodation.description}</p>
            </div>
        `;
        searchResultsGrid.appendChild(card);
    });
}


// Logica de checkin checkout
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


  window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-background');
        const browseSection = document.querySelector('.browse-section');
        const moduloBuscador = document.querySelector('.search-form-container');

        const scrollY = window.scrollY;
        const screenHeight = window.innerHeight;
        console.log(scrollY);

        // Si se ha hecho scroll de al menos el 10% de la pantalla
        if (scrollY > screenHeight * 0.1) {
            hero.classList.add('achicarse');
            browseSection.classList.add('achicar');
            moduloBuscador.classList.add('achicar');
        } else {
            hero.classList.remove('achicarse');
            browseSection.classList.remove('achicar');
            moduloBuscador.classList.remove('achicar');
            
            

        }
        let hasSnapped = false;
        if (scrollY < screenHeight * 0.05  && !hasSnapped) {
            hasSnapped = true;
            window.scrollTo({
            top: 0,
            behavior: "smooth"
            });
        }
        // Evita múltiples disparos
        setTimeout(() => {
        hasSnapped = false;
        }, 500);
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