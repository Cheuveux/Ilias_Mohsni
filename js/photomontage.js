// Ajoute des événements au hover/clic sur les vidéos .video-lignes
function setupVideoLignesInteractions() {
  const videos = document.querySelectorAll('.video-container.video-lignes video');
  console.log('🎬 Setup interactions pour', videos.length, 'vidéos lignes-brandt');
  
  videos.forEach(video => {
    // Évite d'ajouter les listeners plusieurs fois
    if (video.dataset.interactionsSetup) return;
    video.dataset.interactionsSetup = 'true';
    video.dataset.activated = 'false'; // Ajout d'un état

    console.log('✅ Interactions ajoutées pour vidéo:', video.src);

    // Desktop : play au hover UNIQUEMENT après clic
    video.addEventListener('mouseenter', () => {
      if (video.dataset.activated === 'true') {
        video.play();
        gsap.to(video, {
          scale: 1.12,
          rotateZ: 2,
          opacity: 0.92,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });
    video.addEventListener('mouseleave', () => {
      if (video.dataset.activated === 'true') {
        video.pause();
        video.currentTime = 0;
        gsap.to(video, {
          scale: 1,
          rotateZ: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });

    // Mobile & Desktop : play au clic (active le hover ensuite)
    video.addEventListener('click', () => {
      video.dataset.activated = 'true';
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

    // Toujours en pause au départ
    video.pause();

    // // Auto-play au scroll/visibilité (desktop ET mobile)
    // video.addEventListener('loadeddata', () => {
    //   video.play();
    // });
  });
}

// Lance la fonction au DOMContentLoaded et aussi après que scroll.js charge les vidéos
// window.addEventListener('DOMContentLoaded', () => {
//   setupVideoLignesInteractions();
  
//   // ✅ Relance après 1 seconde pour être sûr que les vidéos sont chargées
//   setTimeout(() => {
//     setupVideoLignesInteractions();
//   }, 1000);
  
//   // ✅ Relance après 3 secondes (au cas où le chargement est lent)
//   setTimeout(() => {
//     setupVideoLignesInteractions();
//   }, 3000);
// });

// // ✅ Observer uniquement sur la section photomontage
// const photomontageSection = document.getElementById('photomontage');
// if (photomontageSection) {
//   const observer = new MutationObserver(() => {
//     setupVideoLignesInteractions();
//   });
//   observer.observe(photomontageSection, { childList: true, subtree: true });
// }

// // ✅ Écoute aussi l'événement window.load pour être sûr
// window.addEventListener('load', () => {
//   setTimeout(() => {
//     setupVideoLignesInteractions();
//   }, 500);
// });
  function createMissingVideos() {
  const containers = document.querySelectorAll('.video-container.video-lignes');
  
  containers.forEach(container => {
    // Si la vidéo n'existe pas, la créer
    if (!container.querySelector('video')) {
      const isMobile = window.innerWidth <= 625;
      const src = isMobile 
        ? container.dataset.srcMobile 
        : container.dataset.srcDesktop;
      
      if (src) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = false;
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.display = 'block';
        container.appendChild(video);
        console.log('✅ Vidéo créée:', src);
      }
    }
  });
  
  // Lance les interactions après création
  setupVideoLignesInteractions();
}

// Appelle cette fonction au démarrage
window.addEventListener('DOMContentLoaded', () => {
  createMissingVideos();
  setupVideoLignesInteractions();
  
  setTimeout(() => {
    createMissingVideos();
  }, 1000);
});
