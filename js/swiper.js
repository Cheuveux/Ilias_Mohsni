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
          video.preload = "none";
          video.className = isMobile ? 'format-bigo' : 'format-ordi';
          video.style.opacity = 0;
          container.appendChild(video);

          // GSAP apparition
          video.addEventListener('loadeddata', () => {
            gsap.to(video, { opacity: 1, duration: 1, ease: "power2.out" });
          });

          // Lecture automatique sur mobile après interaction utilisateur
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
      }, 600 + wait);
    });
  }
  hideLoaderWhenReady();
});

