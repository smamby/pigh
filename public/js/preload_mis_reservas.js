document.addEventListener('DOMContentLoaded', () => {

    const navregisteraloj = document.getElementById("nav-register-alojamiento")
    const navlogin = document.getElementById("nav-login")
    const navmis = document.getElementById("nav-mis-reservas")
    const navlogout = document.getElementById("nav-logout")
    const navavatar = document.getElementById("avatar-img")

    if (sessionStorage.getItem('user') !== null) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userName = document.getElementById('username');
        userName.textContent = `${user.nombre} ${user.apellido}`;
        navregisteraloj.classList.add('loged')
        navlogin.classList.add('loged')
        navmis.classList.add('loged')
        navlogout.classList.add('loged')
        // navavatar.classList.add('loged')
        navavatar.src = '../assets/pic/avatar1.png'
        console.log(user.nombre + " loged");
    } else {
        navregisteraloj.classList.remove('loged')
        navlogin.classList.remove('loged')
        navmis.classList.remove('loged')
        navlogout.classList.remove('loged')
        // navavatar.classList.remove('loged')
        navregisteraloj.classList.add('unloged')
        navlogin.classList.add('unloged')
        navmis.classList.add('unloged')
        navlogout.classList.add('unloged')
        // navavatar.classList.add('unloged')
        navavatar.src = './assets/pic/avatar0.png'
        console.log("unloged");
    }

    document.getElementById('nav-logout').addEventListener('click', function (e) {
        e.preventDefault(); // Evita que navegue inmediatamente

        // Borra datos del sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // Redirige manualmente
        window.location.href = "../index.html";
    });

    
    

    
});