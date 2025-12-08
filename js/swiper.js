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
  let checkAttempts = 0;
  const maxAttempts = 30; // 3 secondes max (30 * 100ms)

  // Vérifie toutes les 100ms si la première vidéo est chargée
  const checkVideo = setInterval(() => {
    checkAttempts++;
    const firstVideo = document.querySelector('.video-production .swiper-slide video, .video-production video');
    
    if ((firstVideo && firstVideo.readyState >= 2) || checkAttempts >= maxAttempts) {
      videoLoaded = true;
      clearInterval(checkVideo);
      hideLoader();
    }
  }, 100);

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

