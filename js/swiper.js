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

  // Insère la bonne version vidéo dans chaque container
  document.querySelectorAll('.video-container').forEach(container => {
    if (container.querySelector('video')) return;
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
  });

  // Initialise Swiper normalement
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
      },
    });
  });
});
