document.addEventListener('DOMContentLoaded', () => {
  const icons = {
    play: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/playBtn.svg',
    pause: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/pauseBtn.svg',
    volumeOn: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/soundBtn.svg',
    volumeOff: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/soundMuted.svg',
    fullscreen: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/fullScreenBtn.svg',
    exitFullscreen: 'https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/exitFullScreen.svg'
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  function initVideoControls(video) {
    if (!video || video.dataset.videoControlsInitialized === 'true') return;

    const container = video.closest('.video-container, .video-container-runner');
    if (!container) return;

    video.dataset.videoControlsInitialized = 'true';

    const controls = container.querySelector('.controls, .controls-perso');
    const playButton = container.querySelector('[id^="playPause"], .control-btn[aria-label="play"]');
    const soundButton = container.querySelector('[id^="toggleMute"], .control-btn[aria-label="mute"]');
    const fullscreenButton = container.querySelector('[id^="fullscreen"], .control-btn[aria-label="fullscreen"]');
    const progressBar = container.querySelector('.progressBar');
    const currentTime = container.querySelector('[class^="currentTime"]');
    const totalTime = container.querySelector('[class^="timeTotal"]');
    const playIcon = playButton?.querySelector('img');
    const soundIcon = soundButton?.querySelector('img');
    const fullscreenIcon = fullscreenButton?.querySelector('img');

    const setPlayIcon = () => {
      if (playIcon) playIcon.src = video.paused ? icons.play : icons.pause;
    };

    playButton?.addEventListener('click', () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });

    video.addEventListener('play', setPlayIcon);
    video.addEventListener('pause', setPlayIcon);
    video.addEventListener('ended', setPlayIcon);

    video.addEventListener('timeupdate', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (progressBar) progressBar.value = (video.currentTime / video.duration) * 100;
      if (currentTime) currentTime.textContent = formatTime(video.currentTime);
      if (totalTime) totalTime.textContent = formatTime(video.duration);
    });

    video.addEventListener('loadedmetadata', () => {
      if (totalTime) totalTime.textContent = formatTime(video.duration);
    });

    progressBar?.addEventListener('input', () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = (Number(progressBar.value) / 100) * video.duration;
      }
    });

    soundButton?.addEventListener('click', () => {
      video.muted = !video.muted;
      if (soundIcon) soundIcon.src = video.muted ? icons.volumeOff : icons.volumeOn;
    });

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        const request = container.requestFullscreen?.();
        request?.catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };

    fullscreenButton?.addEventListener('click', toggleFullscreen);
    container.addEventListener('dblclick', toggleFullscreen);

    document.addEventListener('fullscreenchange', () => {
      if (fullscreenIcon && document.fullscreenElement === container) {
        fullscreenIcon.src = icons.exitFullscreen;
      } else if (fullscreenIcon) {
        fullscreenIcon.src = icons.fullscreen;
      }
      if (controls && document.fullscreenElement === container) controls.style.opacity = '1';
    });

    let hideControlsTimeout;
    const showControls = () => {
      if (!controls) return;
      controls.style.opacity = '1';
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => {
        if (!video.paused) controls.style.opacity = '0';
      }, 2500);
    };

    video.addEventListener('mousemove', showControls);
    video.addEventListener('play', showControls);
    video.addEventListener('pause', showControls);

    container.addEventListener('keydown', (event) => {
      if (event.code !== 'Space' || event.target.matches('input, button')) return;
      event.preventDefault();
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });

    setPlayIcon();
  }

  document.querySelectorAll('video').forEach(initVideoControls);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches('video')) initVideoControls(node);
        node.querySelectorAll('video').forEach(initVideoControls);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
