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
    });

    // Remet tous les slides visibles au chargement
    swiperEl.querySelectorAll('.swiper-slide').forEach(slide => {
      gsap.set(slide, { opacity: 1 });
    });

    swiperInstance.on('slideChangeTransitionStart', () => {
      // Animation GSAP : fade out tous les slides sauf l'actif, fade in l'actif
      swiperEl.querySelectorAll('.swiper-slide').forEach(slide => {
        if (!slide.classList.contains('swiper-slide-active')) {
          gsap.to(slide, { opacity: 0, duration: 0.5, overwrite: true });
        }
      });
      const activeSlide = swiperEl.querySelector('.swiper-slide-active');
      if (activeSlide) {
        gsap.to(activeSlide, { opacity: 1, duration: 0.6, overwrite: true, delay: 0.1 });
      }

      // Gestion vidéo
      const slides = swiperEl.querySelectorAll('.swiper-slide');
      slides.forEach(slide => {
        const container = slide.querySelector('.video-container');
        if (!container) return;

        // Si slide actif OU s'il n'y a qu'un seul slide
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
        } else if (slides.length > 1) {
          // On ne retire la vidéo que s'il y a plusieurs slides
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
      // Si un seul slide, on prend le premier
      let activeSlide = swiperEl.querySelector('.swiper-slide-active .video-container');
      if (!activeSlide && swiperEl.querySelectorAll('.swiper-slide').length === 1) {
        activeSlide = swiperEl.querySelector('.swiper-slide .video-container');
      }
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

// Appel des fonctions
removeDesktopBonusSlides();
initAllSwipers();
