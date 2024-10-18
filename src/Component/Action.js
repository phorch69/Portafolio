const Menu = document.getElementById('Menu');
const BarraLateral = document.querySelector('.Aside');
const Lateral = document.querySelectorAll("p");

Menu.addEventListener('click', function() {
    BarraLateral.classList.toggle("mini-Aside");
    Lateral.forEach((p)=>{
        p.classList.toggle("oculto");
    });
});