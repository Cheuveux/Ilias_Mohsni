function removeDesktopBonusSlides() {
  if (window.innerWidth <= 1050) {
    document.querySelectorAll('.swiper-slide.desktop-only').forEach(slide => slide.remove());
  }
  if (window.innerWidth >= 1050) {
    document.querySelectorAll('.swiper-slide.mobile-only').forEach(slide => slide.remove());
  }
}

function handleVideos(swiperEl) {
  const slides = swiperEl.querySelectorAll('.swiper-slide');
  slides.forEach(slide => {
    // Pour chaque container vidéo dans le slide
    slide.querySelectorAll('.video-container').forEach(container => {
      // Slide actif ou unique
      if (slide.classList.contains('swiper-slide-active') || slides.length === 1) {
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
          video.preload = "auto";
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('x5-playsinline', 'true');
          video.controls = false;
          video.className = isMobile ? 'format-bigo' : 'format-ordi';
          video.style.opacity = 0;
          container.appendChild(video);

          // Force le play immédiatement et de manière agressive
          const forcePlay = () => {
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Video playing successfully');
              }).catch((error) => {
                console.log('Autoplay blocked, retry on user interaction:', error);
                // Retry sur n'importe quelle interaction
                ['touchstart', 'touchend', 'click'].forEach(eventType => {
                  document.addEventListener(eventType, function retry() {
                    video.play().then(() => {
                      ['touchstart', 'touchend', 'click'].forEach(type => {
                        document.removeEventListener(type, retry);
                      });
                    });
                  }, { once: true });
                });
              });
            }
          };

          // GSAP apparition + force play
          video.addEventListener('loadeddata', () => {
            gsap.to(video, { opacity: 1, duration: 0.3, ease: "power2.out" });
            forcePlay();
          });

          // Retry play après un court délai
          setTimeout(() => forcePlay(), 100);
          
        } else {
          const video = container.querySelector('video');
          video.muted = true;
          video.play().catch(() => {
            // Retry on interaction
            ['touchstart', 'click'].forEach(eventType => {
              document.addEventListener(eventType, () => video.play(), { once: true });
            });
          });
        }
      } else if (slides.length > 1) {
        // Retire la vidéo des containers inactifs
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
}

document.addEventListener('DOMContentLoaded', () => {
  removeDesktopBonusSlides();

  document.querySelectorAll('.swiper').forEach(swiperEl => {
    let swiperInstance = new Swiper(swiperEl, {
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
      },
      on: {
        init: function () {
          handleVideos(swiperEl);
        },
        slideChangeTransitionStart: function () {
          handleVideos(swiperEl);
        }
      }
    });
  });

  // Loader : attend que la vidéo du slide actif du premier swiper soit chargée, min 2s
  const firstSwiper = document.querySelector('.swiper');
  const loader = document.getElementById('intro-loader');
  if (!firstSwiper || !loader) {
    if (loader) loader.style.display = 'none';
    return;
  }
  const getActiveVideo = () => {
    const activeSlide = firstSwiper.querySelector('.swiper-slide-active .video-container');
    return activeSlide ? activeSlide.querySelector('video') : null;
  };
  const start = Date.now();
  function hideLoaderWhenReady() {
    const video = getActiveVideo();
    if (!video) {
      setTimeout(hideLoaderWhenReady, 50);
      return;
    }
    video.addEventListener('loadeddata', () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 2000 - elapsed);
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = 'none';
        // ✅ Active le scroll après que le loader soit complètement caché
        if (window.enableScrollAfterLoad) {
          window.enableScrollAfterLoad();
        }
      }, 600 + wait);
    });
  }
  hideLoaderWhenReady();
});

