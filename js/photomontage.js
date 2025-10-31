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

// Mobile : play au clic
videos.forEach(video => {
  video.addEventListener('click', () => {
    if (!video.src) video.src = video.dataset.src;
    video.play();
  });
});

// Desktop : play au hover
videos.forEach(video => {
  video.addEventListener('mouseenter', () => {
    if (!video.src) video.src = video.dataset.src;
    video.play();
    video.style.transform = "scale(1.1)"; 
  });
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
     video.style.transform = "scale(1)";
  });
});