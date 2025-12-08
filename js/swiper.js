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

  // Loader : attend 2s minimum, puis active le scroll
  const loader = document.getElementById('intro-loader');
  if (loader) {
    const start = Date.now();
    setTimeout(() => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 2000 - elapsed);
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.style.display = 'none';
        if (window.enableScrollAfterLoad) {
          window.enableScrollAfterLoad();
        }
      }, 600 + wait);
    }, 2000);
  }
});

