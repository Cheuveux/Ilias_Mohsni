// Sélectionne toutes les vidéos et images
const mediaElements = document.querySelectorAll("video, img");

// Crée un observer pour les médias
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;

    if (entry.isIntersecting) {
      if (el.tagName === "VIDEO") {
        el.play();
      } else if (el.tagName === "IMG" && el.dataset.src) {
        el.src = el.dataset.src; // charge l'image
      }
    } else {
      if (el.tagName === "VIDEO") {
        el.pause();
      }
    }
  });
}, {
  threshold: 0.1 // ajustable selon besoin
});

// Initialisation pour chaque élément
mediaElements.forEach(el => {
  if (el.tagName === "VIDEO") {
    el.preload = "none";
  } else if (el.tagName === "IMG") {
    // stocke le src réel dans data-src et vide src pour lazy load
    if (el.hasAttribute("src")) {
      el.dataset.src = el.src;
      el.src = "";
    }
  }
  observer.observe(el);
});
