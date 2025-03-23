// import Swiper bundle with all modules installed
import Swiper from "swiper/bundle";

// import styles bundle
// import "swiper/css/bundle.";

function swiper() {
    /* Initialize Swiper */
    const swiper = new Swiper(".swiper", {
        // Optional parameters
        // direction: "vertical",
        // spaceBetween: 30,
        // loop: true,
        slidesPerView: 1,
        // freeMode: true,
        grabCursor: true,
        effect: "fade",
        lazy: true,
        speed: 1000, //Скорость прокрутки
        /* Autoplay */
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            reverseDirection: true, //обратное направление
        },
        breakpoints: {
            // 510: {
            //     slidesPerView: 'auto',
            //     spaceBetween: 26,
            // },
            768: {
                slidesPerView: "auto",
                spaceBetween: 33,
            },
            // 1160: {
            //     slidesPerView: 'auto',
            //     spaceBetween: 33,
            // },
        },

        // If we need pagination
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        // Navigation arrows
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        // And if we need scrollbar
        // scrollbar: {
        //     el: ".swiper-scrollbar",
        // },
    });
}

export default swiper;
