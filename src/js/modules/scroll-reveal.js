// --------- Scroll Reveal ---------------------
import ScrollReveal from '../../lib/scrollreveal'

function scrollRevealFunc() {
    // Базовые настройки
    ScrollReveal({
        distance: "60px",
        duration: 1500,
        reset: true,
    });

    ScrollReveal().reveal(".nav", {
        origin: "top",
        delay: 500,
    });

    ScrollReveal().reveal(".header__desc", {
        origin: "bottom",
        delay: 1000,
    });

    ScrollReveal().reveal(".scroll-text__bullet-left", {
        origin: "left",
        delay: 1500,
    });

    ScrollReveal().reveal(".scroll-text__bullet-right", {
        origin: "right",
        delay: 1500,
    });
}

export default scrollRevealFunc;