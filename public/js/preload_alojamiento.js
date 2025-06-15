document.addEventListener('DOMContentLoaded', () => {            
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
            const destinationInput = document.getElementById('destinationInput');
            const tipoAlojamientoInput = document.getElementById('tipoAlojamientoInput');


            const navregister = document.getElementById("nav-register")
            const navlogin = document.getElementById("nav-login")
            const navmis = document.getElementById("nav-mis-reservas")
            const navlogout = document.getElementById("nav-logout")
            const navavatar = document.getElementById("avatar-img")

            const alojamientoI = sessionStorage.getItem('alojamientoId');
            const AdultsInput = sessionStorage.getItem('adults');
            const ChildrenInput = sessionStorage.getItem('children');         
            const RoomsInput = sessionStorage.getItem('rooms');
        
            const days = sessionStorage.getItem('days');
            const tipoAlojamientoNombre = sessionStorage.getItem('tipoAlojamiento');

            if (sessionStorage.getItem('user') !== null) {
                const user = JSON.parse(sessionStorage.getItem('user'));
                const userName = document.getElementById('username');
                userName.textContent = `${user.nombre} ${user.apellido}`;
                navregister.classList.add('loged')
                navlogin.classList.add('loged')
                navmis.classList.add('loged')
                navlogout.classList.add('loged')
                // navavatar.classList.add('loged')
                navavatar.src = '../assets/pic/avatar1.png'
                console.log(user.nombre + " loged");
            } else {
                navregister.classList.remove('loged')
                navlogin.classList.remove('loged')
                navmis.classList.remove('loged')
                navlogout.classList.remove('loged')
                // navavatar.classList.remove('loged')
                navregister.classList.add('unloged')
                navlogin.classList.add('unloged')
                navmis.classList.add('unloged')
                navlogout.classList.add('unloged')
                // navavatar.classList.add('unloged')
                navavatar.src = '../assets/pic/avatar0.png'
                console.log("unloged");
            }

            document.getElementById('nav-logout').addEventListener('click', function (e) {
                e.preventDefault(); // Evita que navegue inmediatamente

                // Borra datos del sessionStorage
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');

                // Redirige manualmente
                //window.location.href = "../index.html";
            });

            
            

            
        });