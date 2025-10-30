const container = document.querySelector(".video-container");
const video = container.querySelector("video");
const playButton = document.getElementById("playPause");
const playIconImg = playButton.querySelector("img");
const progressBar = document.getElementById("progressBar");
const soundButton = document.getElementById("toggleMute");
const soundIconImg = soundButton.querySelector("img");
const fullScreenButton = document.getElementById("fullscreen");
const fullScreenImgIcon = fullScreenButton.querySelector("img");
const controls = document.querySelector(".controls");
const timeCurrent= document.querySelector(".currentTime");
const timeTotal = document.querySelector(".timeTotal");


// Chemins des icônes
const playIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/playBtn.svg";
const pauseIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/pauseBtn.svg";
const volumeOnIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/soundBtn.svg";
const volumeOffIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/soundMuted.svg";
const fullscreenIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/fullScreenBtn.svg";
const exitFullscreenIcon = "https://pub-a10275f333c642cb944fe34bf2332caa.r2.dev/icons/exitFullScreen.svg";

// --- PLAY / PAUSE ---
playButton.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playIconImg.src = pauseIcon;
  } else {
    video.pause();
    playIconImg.src = playIcon;
  }
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`; 
}

// --- PROGRESS BAR ---
video.addEventListener("timeupdate", () => {
  if (video.duration) {
    progressBar.max = 100;
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.value = percent;
    if (timeCurrent) 
      timeCurrent.textContent = formatTime(video.currentTime);
    if(timeTotal) 
      timeTotal.textContent = formatTime(video.duration);
  }
});

progressBar.addEventListener("input", () => {
  if (video.duration) {
    const newTime = (progressBar.value / 100) * video.duration;
    video.currentTime = newTime;
  }
});

// --- MUTE / UNMUTE ---
soundButton.addEventListener("click", () => {
  video.muted = !video.muted;
  soundIconImg.src = video.muted ? volumeOffIcon : volumeOnIcon;
});

// --- FULLSCREEN ---
fullScreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    container.requestFullscreen(); 
    fullScreenImgIcon.src = fullscreenIcon;
   
  } else {
    document.exitFullscreen();
    fullScreenImgIcon.src = exitFullscreenIcon;
  }
});

// --- AFFICHAGE DES CONTRÔLES EN FULLSCREEN ---
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    controls.style.position = "absolute";
    controls.style.bottom = "10px";
    controls.style.left = "50%";
    controls.style.transform = "translateX(-50%)";
    controls.style.zIndex = "9999";
    controls.style.display = "flex";
    controls.style.opacity = "1";
  } 
});

let hideControlsTimeout;

function showControls() {
  controls.style.opacity = "1";
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(() => {
    if (!video.paused) controls.style.opacity = "0";
  }, 2500);
}

video.addEventListener("mousemove", showControls);
video.addEventListener("play", showControls);
video.addEventListener("pause", () => (controls.style.opacity = "1"));


video.addEventListener("play", () => (playIconImg.src = pauseIcon));
video.addEventListener("pause", () => (playIconImg.src = playIcon));

document.addEventListener('keydown', (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (video.paused) {
      video.play();
      playIconImg.src = pauseIcon;
    }
    else {
      video.pause();
      playIconImg.src = playIcon;
    }
  }
});

container.addEventListener('dblclick', () => {
  if(!document.fullscreenElement) {
    container.requestFullscreen();
    fullScreenImgIcon.src = exitFullscreenIcon;
  }
  else {
    document.exitFullscreen();
    fullScreenImgIcon.src = fullscreenIcon;
  }
})