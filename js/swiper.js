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
      threshold: 5,
      resistance: true,
      resistanceRatio: 0.85,
      touchStartPreventDefault: false,
      touchMoveStopPropagation: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      }
    });
  });

  const loader = document.getElementById('intro-loader');
  const loadingText = document.querySelector('.loading-text');
  const enterBtn = document.getElementById('enter-site-btn');
  const isMobile = window.innerWidth <= 625;
  
  let isLoaded = false;
  let minTimeElapsed = false;

  // Cache le texte "Loading..." et affiche le bouton ENTER
  function showEnterButton() {
    if (isLoaded && minTimeElapsed) {
      if (loadingText) {
        loadingText.style.opacity = 0;
        setTimeout(() => {
          loadingText.style.display = 'none';
        }, 300);
      }
      if (enterBtn) {
        enterBtn.classList.add('visible');
      }
    }
  }

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
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
      
      const firstSection = document.getElementById('video-production');
      if (firstSection && isMobile) {
        window.scrollTo({
          top: firstSection.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 600);

    sessionStorage.setItem('hasEnteredSite', 'true');
  }

  // Minimum 3 secondes d'affichage
  setTimeout(() => {
    minTimeElapsed = true;
    showEnterButton();
  }, 3000);

  // Détection du chargement complet
  window.addEventListener('load', () => {
    isLoaded = true;
    showEnterButton();
  });

  // Clic sur le bouton ENTER
  if (enterBtn) {
    enterBtn.addEventListener('click', enterSite);
  }
});

