window.addEventListener('DOMContentLoaded', () => { 
  gsap.from("main", {opacity: 0, duration: 1});

  // Animation de la description (du haut vers le bas, fondu)
  gsap.from(".description > *", {
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