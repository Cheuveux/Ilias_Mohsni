function removeDesktopBonusSlides() {
  if (window.innerWidth <= 1050) {
    const desktopBonusSlides = document.querySelectorAll('.swiper-slide.desktop-only');
    desktopBonusSlides.forEach(slide => slide.remove());
  }

  if(window.innerWidth >= 1050) {
    const mobileBonusSlides = document.querySelectorAll('.swiper-slide.mobile-only');
    mobileBonusSlides.forEach(slide => slide.remove());
  }
}


let swiper;

function initSwiper() {
  if (swiper && typeof swiper.destroy === 'function') {
    swiper.destroy(true, true);
  }
  swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3,
    },
    scrollbar: {
      el: '.swiper-scrollbar',
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

  const videos = document.querySelectorAll('.swiper-slide video');
  videos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
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
}

function setupSwiper() {
  removeDesktopBonusSlides();
  initSwiper();
}

function insertResponsiveVideos() {
  document.querySelectorAll('.video-container').forEach(container => {
    // Évite de dupliquer la vidéo si déjà présente
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
    container.appendChild(video);

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
}

// Appelle cette fonction AVANT d'initialiser Swiper
document.addEventListener('DOMContentLoaded', () => {
  removeDesktopBonusSlides();
  insertResponsiveVideos();
  setupSwiper();
});

window.addEventListener('resize', () => {
  insertResponsiveVideos();
  setupSwiper();
});
