document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchResultsGrid = document.getElementById('searchResultsGrid');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const destination = destinationSelect.value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adults = parseInt(adultsHiddenInput.value) || 1;
        const children = parseInt(childrenHiddenInput.value) || 0;
        const rooms = parseInt(roomsHiddenInput.value) || 1;

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

        console.log('Parámetros de búsqueda:', searchParams);

        try {
            const response = await fetch('https://localhost:3001/api/alojamientos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchParams)
            });
            const data = await response.json(); // Assuming the API returns JSON

        

            //renderSearchResults(accommodations);

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
    });