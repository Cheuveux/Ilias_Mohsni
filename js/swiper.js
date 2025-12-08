function removeDesktopBonusSlides() {
  if (window.innerWidth <= 1050) {
    document.querySelectorAll('.swiper-slide.desktop-only').forEach(slide => slide.remove());
  }
  if (window.innerWidth >= 1050) {
    document.querySelectorAll('.swiper-slide.mobile-only').forEach(slide => slide.remove());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  removeDesktopBonusSlides();

  document.querySelectorAll('.swiper').forEach(swiperEl => {
    new Swiper(swiperEl, {
      direction: 'horizontal',
      loop: swiperEl.querySelectorAll('.swiper-slide').length > 1,
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      scrollbar: {
        el: swiperEl.querySelector('.swiper-scrollbar'),
        draggable: true,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      simulateTouch: true,
      touchRatio: 2,
      touchAngle: 45,
      // ✅ Amélioration pour différencier scroll horizontal et vertical
      threshold: 10,
      resistance: true,
      resistanceRatio: 0.85,
      touchStartPreventDefault: false,
      touchMoveStopPropagation: true,
      allowTouchMove: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      }
    });
  });

  const loader = document.getElementById('intro-loader');
  const enterBtn = document.getElementById('enter-site-btn');
  const isMobile = window.innerWidth <= 625;
  const hasVisited = sessionStorage.getItem('hasVisitedSite');
  
  // ✅ Si déjà visité, cache IMMÉDIATEMENT le loader (pas de flash)
  if (hasVisited && loader) {
    loader.remove(); // Supprime complètement du DOM
  }

  // ✅ Fait apparaître le bouton ENTER après chargement complet
  window.addEventListener('load', () => {
    if (enterBtn && !hasVisited) {
      setTimeout(() => {
        enterBtn.classList.add('loaded');
      }, 500); // Petit délai pour effet smooth
    }
  });

  // Fonction pour lancer les vidéos et cacher le loader
  function enterSite() {
    console.log('🚀 Entrée sur le site - Lancement des vidéos');
    
    // Lance TOUTES les vidéos
    document.querySelectorAll('video').forEach(video => {
      video.muted = true;
      video.play().catch(() => {
        console.log('Autoplay bloqué');
      });
    });

    // Cache le loader complet
    if (loader) {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.remove(); // Supprime du DOM au lieu de juste cacher
      }, 600);
    }
      
    const firstSection = document.getElementById('video-production');
    if (firstSection && isMobile) {
      window.scrollTo({
        top: firstSection.offsetTop,
        behavior: 'smooth'
      });
    }

    sessionStorage.setItem('hasVisitedSite', 'true');
  }

  // Clic sur le bouton ENTER
  if (enterBtn) {
    enterBtn.addEventListener('click', enterSite);
  }
});

