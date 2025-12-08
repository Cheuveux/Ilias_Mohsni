// Ajoute des événements au hover/clic sur les vidéos .video-lignes
function setupVideoLignesInteractions() {
  const videos = document.querySelectorAll('.video-container.video-lignes video');
  
  videos.forEach(video => {
    // Évite d'ajouter les listeners plusieurs fois
    if (video.dataset.interactionsSetup) return;
    video.dataset.interactionsSetup = 'true';

    // Desktop : play au hover
    video.addEventListener('mouseenter', () => {
      video.play();
      gsap.to(video, {
        scale: 1.12,
        rotateZ: 2,
        opacity: 0.92,
        duration: 0.6,
        ease: "power2.out"
      });
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      gsap.to(video, {
        scale: 1,
        rotateZ: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    // Mobile : play au clic
    video.addEventListener('click', () => {
      video.play();
      gsap.to(video, {
        scale: 1.08,
        rotateZ: 1,
        opacity: 0.95,
        duration: 0.6,
        ease: "power2.out"
      });
      setTimeout(() => {
        gsap.to(video, {
          scale: 1,
          rotateZ: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      }, 1200);
    });

    // // Auto-play au scroll/visibilité (desktop ET mobile)
    // video.addEventListener('loadeddata', () => {
    //   video.play();
    // });
  });
}

// Lance la fonction au DOMContentLoaded et aussi après que scroll.js charge les vidéos
window.addEventListener('DOMContentLoaded', () => {
  setupVideoLignesInteractions();
  
  // ✅ Relance après 1 seconde pour être sûr que les vidéos sont chargées
  setTimeout(() => {
    setupVideoLignesInteractions();
  }, 1000);
  
  // ✅ Relance après 3 secondes (au cas où le chargement est lent)
  setTimeout(() => {
    setupVideoLignesInteractions();
  }, 3000);
});

// ✅ Observer uniquement sur la section photomontage
const photomontageSection = document.getElementById('photomontage');
if (photomontageSection) {
  const observer = new MutationObserver(() => {
    setupVideoLignesInteractions();
  });
  observer.observe(photomontageSection, { childList: true, subtree: true });
}

// ✅ Écoute aussi l'événement window.load pour être sûr
window.addEventListener('load', () => {
  setTimeout(() => {
    setupVideoLignesInteractions();
  }, 500);
});