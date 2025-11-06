const videos = document.querySelectorAll('.video-lignes');

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-lignes').forEach(video => {
    const src = video.dataset.src;
    if (src) {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'video';
      preload.href = src;
      document.head.appendChild(preload);
    }
  });
});

// ...existing code...

// Desktop : play au hover
videos.forEach(video => {
  video.addEventListener('mouseenter', () => {
    if (!video.src) video.src = video.dataset.src;
    video.play();
    gsap.to(video, {
      scale: 1.12,
      rotateZ: 2,
      opacity: 0.92,
      duration: 0.6,
      ease: "power2.out"
    });
  });
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    gsap.to(video, {
      scale: 1,
      rotateZ: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  });
});

// Mobile : play au clic
videos.forEach(video => {
  video.addEventListener('click', () => {
    if (!video.src) video.src = video.dataset.src;
    video.play();
    gsap.to(video, {
      scale: 1.08,
      rotateZ: 1,
      opacity: 0.95,
      duration: 0.6,
      ease: "power2.out"
    });
    setTimeout(() => {
      gsap.to(video, {
        scale: 1,
        rotateZ: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, 1200);
  });
});