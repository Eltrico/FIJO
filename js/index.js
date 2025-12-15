

// Abrir/fechar menu mobile
function toggleMenu() {
    const menu = document.getElementById("menu-mobile");
    const overlay = document.getElementById("overlay");
    const btn = document.querySelector(".menu-btn");

    menu.classList.toggle("open");
    overlay.classList.toggle("show");
    btn.classList.toggle("active");
}


// ==============================
// SUBMENU mobile (seta separada)
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const arrows = document.querySelectorAll(".mobile-arrow");

    arrows.forEach(arrow => {
        arrow.addEventListener("click", (e) => {

            e.stopPropagation(); // impede o clique no link

            const submenuId = arrow.getAttribute("data-target");
            const submenu = document.getElementById(submenuId);
            const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

            // Fecha todos os submenus
            document.querySelectorAll(".mobile-submenu").forEach(menu => {
                menu.style.maxHeight = "0px";
            });
            document.querySelectorAll(".mobile-arrow").forEach(btn => {
                btn.classList.remove("rotate");
            });

            // Abre somente o clicado
            if (!isOpen) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                arrow.classList.add("rotate");
            }
        });
    });

});
