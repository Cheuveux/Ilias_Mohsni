// Lazy loading + auto-play/pause des vidéos visibles
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video');

  // Désactive l’autoplay initial
  videos.forEach(v => {
    v.removeAttribute('autoplay');
    v.preload = 'none';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.25 }); // déclenche à 25% de visibilité

  videos.forEach(v => observer.observe(v));
});