function removeDesktopBonusSlides() {
  if (window.innerWidth <= 1050) {
    document.querySelectorAll('.swiper-slide.desktop-only').forEach(slide => slide.remove());
  }
  if (window.innerWidth >= 1050) {
    document.querySelectorAll('.swiper-slide.mobile-only').forEach(slide => slide.remove());
  }
}

function initAllSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {
    let swiperInstance = new Swiper(swiperEl, {
      direction: 'horizontal',
      loop: true,
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
      },
    });

    // Lazy-load vidéo : insère la vidéo uniquement sur le slide actif
    swiperInstance.on('slideChange', () => {
      swiperEl.querySelectorAll('.swiper-slide').forEach((slide, idx) => {
        const container = slide.querySelector('.video-container');
        if (!container) return;

        if (idx === swiperInstance.activeIndex) {
          if (!container.querySelector('video')) {
            const isMobile = window.innerWidth <= 625;
            const src = isMobile ? container.dataset.srcMobile : container.dataset.srcDesktop;
            if (!src) return;
            const video = document.createElement('video');
            video.src = src;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = "none";
            video.className = isMobile ? 'format-bigo' : 'format-ordi';
            container.appendChild(video);

            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                const playOnTouch = () => {
                  video.play();
                  window.removeEventListener('touchstart', playOnTouch);
                };
                window.addEventListener('touchstart', playOnTouch);
              });
            }
          } else {
            const video = container.querySelector('video');
            video.play();
          }
        } else {
          const video = container.querySelector('video');
          if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
            video.remove();
          }
        }
      });
    });

    // Insère la vidéo du slide actif au chargement
    setTimeout(() => {
      const activeSlide = swiperEl.querySelector('.swiper-slide-active .video-container');
      if (activeSlide && !activeSlide.querySelector('video')) {
        const isMobile = window.innerWidth <= 625;
        const src = isMobile ? activeSlide.dataset.srcMobile : activeSlide.dataset.srcDesktop;
        if (src) {
          const video = document.createElement('video');
          video.src = src;
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = "none";
          video.className = isMobile ? 'format-bigo' : 'format-ordi';
          activeSlide.appendChild(video);

          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              const playOnTouch = () => {
                video.play();
                window.removeEventListener('touchstart', playOnTouch);
              };
              window.addEventListener('touchstart', playOnTouch);
            });
          }
        }
      }
    }, 100);
  });
}

function setupSwiper() {
  initAllSwipers();
}

// Appelle cette fonction AVANT d'initialiser Swiper
document.addEventListener('DOMContentLoaded', () => {
  removeDesktopBonusSlides();
  setupSwiper();
});

window.addEventListener('resize', () => {
  removeDesktopBonusSlides();
  setupSwiper();
});
