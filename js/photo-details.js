document.addEventListener("DOMContentLoaded", () => {

  // Animation du header
  gsap.from("header", {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "power2.out"
  });

  // Animation de la description
  gsap.from(".description", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out",
    delay: 0.5
  });

  // Animation des slides du Swiper
  gsap.from(".swiper-slide img", {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2, // apparitions décalées
    delay: 1
  });

  // Animation du footer
  gsap.from(".scrolling-content", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out",
    delay: 1.2
  });
});