function removeDesktopBonusSlides() {
  if (window.innerWidth <= 1050) {
    const desktopBonusSlides = document.querySelectorAll('.swiper-slide.desktop-only');
    desktopBonusSlides.forEach(slide => slide.remove());
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
}

function setupSwiper() {
  removeDesktopBonusSlides();
  initSwiper();
}

document.addEventListener('DOMContentLoaded', () => {
  setupSwiper();
});

window.addEventListener('resize', () => {
  setupSwiper();
});

