/* ================  Mobile navigation  ============================ */
function mobileNav() {
    const navBtn = document.querySelector(".mobile-nav-btn");
    // const closeBtn = document.querySelector(".mobile-close-btn");
    const nav = document.querySelector(".mobile-nav");
    const menuIcon = document.querySelector(".mobile-nav-btn__icon");

    const fade = document.querySelector(".mobile-nav-fade");

    navBtn.onclick = toggleMobile;
    // closeBtn.onclick = toggleMobile;
    fade.onclick = toggleMobile;

    function toggleMobile() {
        // nav.classList.toggle("mobile-nav");  // Если используем одно меню nav/mobile-nav
        nav.classList.toggle("active");
        navBtn.classList.toggle("active");
        menuIcon.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
        fade.classList.toggle("mobile-nav-fade--open");
    }
}

export default mobileNav;