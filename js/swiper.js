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
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      }
    });
  });

  // ✅ Attends que scroll.js charge la première vidéo, PUIS masque le loader
  const loader = document.getElementById('intro-loader');
  if (!loader) return;

  const start = Date.now();
  let videoLoaded = false;

  // Vérifie toutes les 100ms si la première vidéo est chargée
  const checkVideo = setInterval(() => {
    const firstVideo = document.querySelector('.video-production .swiper-slide-active video, .video-production .swiper-slide video');
    
    if (firstVideo && firstVideo.readyState >= 3) { // HAVE_FUTURE_DATA ou plus
      videoLoaded = true;
      clearInterval(checkVideo);
      hideLoader();
    }
  }, 100);

  // Timeout de sécurité : masque le loader après 5s max même si vidéo pas chargée
  setTimeout(() => {
    if (!videoLoaded) {
      clearInterval(checkVideo);
      hideLoader();
    }
  }, 5000);

  function hideLoader() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, 2000 - elapsed); // Min 2s
    
    setTimeout(() => {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = 'none';
        if (window.enableScrollAfterLoad) {
          window.enableScrollAfterLoad();
        }
      }, 600);
    }, wait);
  }
});

