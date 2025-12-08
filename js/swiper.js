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
  const enterBtn = document.getElementById('enter-site-btn');
  const isMobile = window.innerWidth <= 625;
  const hasEntered = sessionStorage.getItem('hasEnteredSite');

  // Fonction pour lancer les vidéos et cacher le loader
  function enterSite() {
    console.log('🚀 Entrée sur le site - Lancement des vidéos');
    
    // Lance TOUTES les vidéos existantes
    document.querySelectorAll('video').forEach(video => {
      video.muted = true;
      video.play().then(() => {
        console.log('✅ Vidéo lancée:', video.src);
      }).catch(err => {
        console.log('❌ Autoplay bloqué:', err);
      });
    });

    // Cache le loader
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
      
      // ✅ Scroll automatique vers la première section (video-production)
      const firstSection = document.getElementById('video-production');
      if (firstSection) {
        window.scrollTo({
          top: firstSection.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 600);

    // ✅ Mémorise que l'utilisateur est entré sur le site
    sessionStorage.setItem('hasEnteredSite', 'true');
  }

  if (isMobile && enterBtn) {
    // ✅ Si l'utilisateur a déjà cliqué ENTER, cache directement le loader
    if (hasEntered) {
      enterSite();
    } else {
      // ✅ Sur mobile : attend le clic sur "ENTER" la première fois
      enterBtn.addEventListener('click', enterSite);
    }
  } else {
    // ✅ Sur desktop : cache le loader après 2s (comportement actuel)
    setTimeout(() => {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, 2000);
  }
});

