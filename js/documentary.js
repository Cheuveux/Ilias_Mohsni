let swiperInstance = null; // global

function initSwiper(){
    const swiperContainer = document.querySelector('.affiche-swiper');

    if(swiperContainer && !swiperInstance) {
        swiperInstance = new Swiper(swiperContainer, {
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            keyboard: {
                enable: true,
                onlyInViewport: true,
            },
        });
    }
}

function destroySwiper(){
    if(swiperInstance){
        swiperInstance.destroy(true, true);
        swiperInstance = null;
    }
}

function handleResize() {
    const afficheContainer = document.querySelector('.affiche-container');
    const swiperEl = document.querySelector('.affiche-swiper');

    if(window.innerWidth < 950){
        if(afficheContainer)
            afficheContainer.style.display = 'none';
        if(swiperEl)
            swiperEl.style.display = 'block';
        initSwiper(); 
    } else {
        if(afficheContainer)
            afficheContainer.style.display = 'flex';
        if(swiperEl)
            swiperEl.style.display = 'none';
        destroySwiper();
    }
}

// Init au chargement
window.addEventListener("DOMContentLoaded", handleResize);
window.addEventListener("resize", handleResize);

window.addEventListener('DOMContentLoaded', () => { 
  gsap.from("main", {opacity: 0, duration: 1});

  // Animation de la description (du haut vers le bas, fondu)
  gsap.from("affiche-container", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.5,
    ease: "power2.out",
    delay: 1 // commence après le fade-in du main
  });
  // Animation de la description (du haut vers le bas, fondu)
  gsap.from("swiper", {
    y: -40,
    opacity: 0,
    duration: 1,
    stagger: 1,
    ease: "power2.out",
    delay: 1 // commence après le fade-in du main
  });
  // Animation de la description (du haut vers le bas, fondu)
  gsap.from(".doc-description > *", {
    y: -40,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out",
    delay: 1 // commence après le fade-in du main
  });

  // Animation de la vidéo, après la description
  gsap.from(".video-container", {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 1.5 // commence après la description (ajuste si besoin)
  });
});