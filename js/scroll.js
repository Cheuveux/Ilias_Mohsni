// Sélection des sections
let sections = gsap.utils.toArray("section");
let currentIndex = 0;
let isScrolling = false;
let initialScrollCaptured = false;
let isInitialLoadComplete = false;
let scrollTimeout = null;

// Clone de la première section pour boucle infinie
if (sections.length > 0) {
    const firstSectionClone = sections[0].cloneNode(true);
    firstSectionClone.setAttribute('id', 'first-section-clone');
    sections[sections.length - 1].parentNode.appendChild(firstSectionClone);
    sections = gsap.utils.toArray("section");
}

// Capture du scroll initial (si utilisateur rafraîchit en milieu de page)
window.addEventListener('load', () => {
    if (window.scrollY > 0) {
        initialScrollCaptured = true;
        for (let i = 0; i < sections.length; i++) {
            if (window.scrollY < sections[i].offsetTop + sections[i].offsetHeight) {
                currentIndex = i;
                break;
            }
        }
    }
});

// Fonction pour désactiver / réactiver le scroll natif
function disableScroll() {
    document.body.style.overflow = 'hidden';
}
function enableScroll() {
    document.body.style.overflow = '';
}

// ---------------------
// 🎡 GESTION DU SCROLL SOURIS
// ---------------------
let lastWheelTime = 0;
window.addEventListener("wheel", (e) => {
    // Bloque le scroll si le chargement initial n'est pas terminé
    if (!isInitialLoadComplete || isScrolling || sections.length === 0) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    // Bloque les petits deltas du trackpad (< 15)
    if (Math.abs(e.deltaY) < 5) return;

    const now = Date.now();
    if (now - lastWheelTime < 800) return;
    lastWheelTime = now;
    
    if (e.deltaY > 0) scrollToSection(currentIndex + 1);
    else if (e.deltaY < 0) scrollToSection(currentIndex - 1);
}, { passive: true });

// ---------------------
// 📱 GESTION DU TOUCH MOBILE
// ---------------------
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchStartTime = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (isScrolling) e.preventDefault();
    touchEndY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchend', (e) => {
    // Bloque le scroll si le chargement initial n'est pas terminé
    if (!isInitialLoadComplete || isScrolling || sections.length === 0) return;
    
    // Vérifie si le touch était sur un lien
    const target = e.target;
    if (target.closest('a')) {
        return; // Ne fait rien si c'est un lien
    }
    
    const deltaY = touchStartY - touchEndY;
    const touchDuration = Date.now() - touchStartTime;
    
    // Ignore les petits swipes verticaux (réduit à 30px) et les touches très courtes
    if (Math.abs(deltaY) < 30 || touchDuration < 50) return;
    
    if (deltaY > 0) scrollToSection(currentIndex + 1);
    else scrollToSection(currentIndex - 1);
});

// ---------------------
// ⌨️ GESTION DU CLAVIER ORDINATEUR
// ---------------------
window.addEventListener('keydown', (e) => {
    // Bloque le scroll si le chargement initial n'est pas terminé
    if (!isInitialLoadComplete || isScrolling || sections.length === 0) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        scrollToSection(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        scrollToSection(currentIndex - 1);
    }
});

// ---------------------
// ANIMATION DES TITRES
// ---------------------
function animateSectionTitles(section) {
    // Animate .title-section (depuis la gauche)
    const title = section.querySelector('.title-section');
    if (title) {
        gsap.set(title, { x: -100, opacity: 0 });
        gsap.to(title, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });
    }
    // Animate TOUS les .content-title (depuis la droite)
    const contents = section.querySelectorAll('.content-title');
    contents.forEach(content => {
        gsap.set(content, { x: 100, opacity: 0 });
        gsap.to(content, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// Fonction pour cacher les titres d'une section
function hideSectionTitles(section) {
    const title = section.querySelector('.title-section');
    if (title) {
        gsap.set(title, { x: -100, opacity: 0 });
    }
    const contents = section.querySelectorAll('.content-title');
    contents.forEach(content => {
        gsap.set(content, { x: 100, opacity: 0 });
    });
}

// ---------------------
// SCROLL FLUIDE AVEC GSAP
// ---------------------
function scrollToSection(index) {
    if (isScrolling || sections.length === 0) return;

    isScrolling = true;
    
    // Sécurité : débloquer isScrolling après 2s maximum
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        enableScroll();
    }, 2000);
    
    disableScroll();
    index = Math.max(0, Math.min(index, sections.length - 1));

    if (index === 0 && initialScrollCaptured) {
        enableScroll();
        isScrolling = false;
        return;
    }

    // Cache tous les titres sauf ceux de la section cible
    sections.forEach((section, i) => {
        if (i !== index) hideSectionTitles(section);
    });

    const targetSection = sections[index];
    const targetPosition = targetSection.offsetTop;

    // Lazy load vidéos de la section cible, retire celles des autres
    sections.forEach((section, i) => {
      if (i === index) {
        lazyLoadSectionVideos(section);
      } else {
        unloadSectionVideos(section);
      }
    });

    gsap.to(window, {
        scrollTo: { y: targetPosition, autoKill: false },
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
            // Clear le timeout de sécurité
            if (scrollTimeout) clearTimeout(scrollTimeout);
            
            animateSectionTitles(targetSection);

            // Si on est sur le clone (last section), on revient à la vraie première section
            if (index === sections.length - 1) {
                gsap.delayedCall(0.05, () => {
                    window.scrollTo(0, sections[0].offsetTop);
                    currentIndex = 0;
                    ScrollTrigger.refresh();
                    enableScroll();
                    isScrolling = false;
                    animateSectionTitles(sections[0]);
                    // Lazy load la vraie première section
                    lazyLoadSectionVideos(sections[0]);
                });
            } else {
                currentIndex = index;
                enableScroll();
                isScrolling = false;
            }
        }
    });
}

// ---------------------
// AU CHARGEMENT, CACHE LES TITRES
// ---------------------
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.title-section').forEach(el => {
        gsap.set(el, { x: -100, opacity: 0 });
    });
    document.querySelectorAll('.content-title').forEach(el => {
        gsap.set(el, { x: 100, opacity: 0 });
    });
    
    // ✅ Sur mobile : charge TOUTES les vidéos d'un coup
    if (window.innerWidth <= 625) {
        loadAllVideosOnMobile();
    }
    
    // Anime la première section au chargement
    if (sections[0]) {
      animateSectionTitles(sections[0]);
      lazyLoadSectionVideos(sections[0]);
    }
    
    // ✅ Active le scroll après 3s comme sécurité si le loader ne le fait pas
    setTimeout(() => {
        if (!isInitialLoadComplete) {
            isInitialLoadComplete = true;
            console.log('⚠️ Scroll activé par timeout de sécurité');
        }
    }, 3000);
});

// Fonction globale appelée par swiper.js quand le loader est caché
window.enableScrollAfterLoad = function() {
    isInitialLoadComplete = true;
    console.log('✅ Scroll activé après chargement initial');
};

// ---------------------
// 🎥 GESTION DES VIDÉOS EN FONCTION DE LA SECTION VISIBLE
// ---------------------

// ✅ Sur mobile : charge TOUTES les vidéos d'un coup
function loadAllVideosOnMobile() {
  const isMobile = window.innerWidth <= 625;
  if (!isMobile) return;

  sections.forEach(section => {
    section.querySelectorAll('.video-container').forEach(container => {
      if (container.querySelector('video')) return;
      const src = container.dataset.srcMobile;
      if (!src) return;
      
      const video = document.createElement('video');
      video.src = src;
      video.autoplay = false; // Ne lance pas toutes les vidéos en même temps
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.controls = false;
      video.className = 'format-bigo';
      video.style.opacity = 0;
      container.appendChild(video);

      // GSAP apparition quand la section devient visible
      video.addEventListener('loadeddata', () => {
        const parentSection = container.closest('section');
        if (parentSection && parentSection.classList.contains('active-section')) {
          gsap.to(video, { opacity: 1, duration: 1, ease: "power2.out" });
        }
      }, { once: true });
    });
  });
}

function lazyLoadSectionVideos(section) {
  const isMobile = window.innerWidth <= 625;
  
  // Sur mobile, les vidéos sont déjà chargées, on les affiche juste
  if (isMobile) {
    section.classList.add('active-section');
    section.querySelectorAll('.video-container video').forEach(video => {
      gsap.to(video, { opacity: 1, duration: 1, ease: "power2.out" });
      
      // Force le play
      const playVideo = () => {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            const retry = () => {
              video.play();
              document.removeEventListener('touchstart', retry);
              document.removeEventListener('click', retry);
            };
            document.addEventListener('touchstart', retry, { once: true });
            document.addEventListener('click', retry, { once: true });
          });
        }
      };
      
      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener('canplay', playVideo, { once: true });
      }
    });
    return;
  }
  
  // Sur desktop : lazy loading classique
  section.querySelectorAll('.video-container').forEach(container => {
    if (container.querySelector('video')) return;
    const src = container.dataset.srcDesktop;
    if (!src) return;
    
    const video = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.controls = false;
    video.className = 'format-ordi';
    video.style.opacity = 0;
    container.appendChild(video);

    video.addEventListener('loadeddata', () => {
      gsap.to(video, { opacity: 1, duration: 1, ease: "power2.out" });
    }, { once: true });

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const retry = () => {
            video.play();
            document.removeEventListener('touchstart', retry);
            document.removeEventListener('click', retry);
          };
          document.addEventListener('touchstart', retry, { once: true });
          document.addEventListener('click', retry, { once: true });
        });
      }
    };

    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
  });
}

function unloadSectionVideos(section) {
  const isMobile = window.innerWidth <= 625;
  
  // Sur mobile : pause les vidéos et masque-les (ne les supprime pas)
  if (isMobile) {
    section.classList.remove('active-section');
    section.querySelectorAll('.video-container video').forEach(video => {
      video.pause();
      gsap.to(video, { opacity: 0, duration: 0.3, ease: "power2.out" });
    });
    return;
  }
  
  // Sur desktop : supprime les vidéos pour libérer la mémoire
  section.querySelectorAll('.video-container video').forEach(video => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
  });
}

window.addEventListener('pageshow', () => {
    // Trouve la section actuellement visible (celle la plus proche du scroll)
    let visibleSection = sections[0];
    let minDist = Math.abs(window.scrollY - sections[0].offsetTop);
    let visibleIndex = 0;
    sections.forEach((section, i) => {
        const dist = Math.abs(window.scrollY - section.offsetTop);
        if (dist < minDist) {
            minDist = dist;
            visibleSection = section;
            visibleIndex = i;
        }
    });
    // ✅ Update currentIndex avec la bonne valeur
    currentIndex = visibleIndex;
    // Réanime les titres et lazy-load les vidéos de la section visible
    if (visibleSection) {
        hideSectionTitles(visibleSection);
        animateSectionTitles(visibleSection);
        lazyLoadSectionVideos(visibleSection);
    }
});