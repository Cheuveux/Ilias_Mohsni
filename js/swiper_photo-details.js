document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    // Boucle infinie, très pratique pour un carrousel photo
    loop: true,
    
    // Ajout strict minimum de la navigation pour les flèches
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});
