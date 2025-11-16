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

    // Animation GSAP pour tous les slides
    swiperInstance.on('slideChange', () => {
      swiperEl.querySelectorAll('.swiper-slide').forEach(slide => {
        gsap.to(slide, { opacity: 0, duration: 0.5, overwrite: true });
      });
      
      swiperInstance.on('slideChangeTransitionStart', () => {
  // Fade out tous les slides sauf l'actif
  swiperEl.querySelectorAll('.swiper-slide').forEach(slide => {
    if (!slide.classList.contains('swiper-slide-active')) {
      gsap.to(slide, { opacity: 0, duration: 0.5, overwrite: true });
    }
  });
  // Fade in le slide actif
  const activeSlide = swiperEl.querySelector('.swiper-slide-active');
  if (activeSlide) {
    gsap.to(activeSlide, { opacity: 1, duration: 0.6, overwrite: true, delay: 0.1 });
  }
});
      // Gestion vidéo
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
