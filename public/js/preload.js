document.addEventListener('DOMContentLoaded', () => {
            const destinationSelect = document.getElementById('destination');
            //const searchForm = document.getElementById('searchForm');
            //const searchResultsGrid = document.getElementById('searchResultsGrid');
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

            // --- 1) Cargar destinos dinámicamente ---
            async function loadDestinations() {
                try {
                    const response = await fetch('http://localhost:3001/api/alojamientos/destinos');
                    const data = await response.json(); // Assuming the API returns JSON
                    const destinations = data;
                    
                     //data.ciudad || ['Buenos Aires', 'Córdoba', 'Mendoza', 'Bariloche', 'Salta']; // Fallback

                    destinationSelect.innerHTML = ''; // Clear existing options
                    destinations.forEach(destination => {
                        const option = document.createElement('option');
                        option.value = destination;
                        option.textContent = destination;
                        destinationSelect.appendChild(option);
                    });
                } catch (error) {
                    console.error('Error loading destinations:', error);
                    // Fallback to default options if API fails
                    const defaultDestinations = ['Buenos Aires', 'Córdoba', 'Mendoza', 'Bariloche', 'Salta'];
                    destinationSelect.innerHTML = '';
                    defaultDestinations.forEach(destination => {
                        const option = document.createElement('option');
                        option.value = destination;
                        option.textContent = destination;
                        destinationSelect.appendChild(option);
                    });
                }
            }

            // Initial load
            loadDestinations();

            
            // --- 3) Lógica del popup de Huéspedes ---
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

            
        });