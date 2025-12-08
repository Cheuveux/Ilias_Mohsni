// ✅ SCROLL NATIF AVEC SNAP + BOUCLE INFINIE
let sections = gsap.utils.toArray("section");

// Clone la première section à la fin pour effet de boucle
if (sections.length > 0) {
    const firstSectionClone = sections[0].cloneNode(true);
    firstSectionClone.setAttribute('id', 'first-section-clone');
    firstSectionClone.classList.add('clone-section');
    sections[sections.length - 1].parentNode.appendChild(firstSectionClone);
    sections = gsap.utils.toArray("section");
}

// Détecte quand on arrive au clone et revient au début
let isLooping = false;
window.addEventListener('scroll', () => {
    if (isLooping) return;
    
    const lastSection = sections[sections.length - 1];
    const scrollPosition = window.scrollY + window.innerHeight;
    const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight;
    
    // Si on est proche de la fin du clone, revient au début
    if (scrollPosition >= lastSectionBottom - 100 && lastSection.classList.contains('clone-section')) {
        isLooping = true;
        window.scrollTo({
            top: sections[0].offsetTop,
            behavior: 'instant'
        });
        setTimeout(() => {
            isLooping = false;
        }, 100);
    }
}, { passive: true });

// ---------------------
// ANIMATION DES TITRES
// ---------------------
function animateSectionTitles(section) {
    const title = section.querySelector('.title-section');
    if (title) {
        gsap.fromTo(title, 
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
    }
    const contents = section.querySelectorAll('.content-title');
    contents.forEach(content => {
        gsap.fromTo(content,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
    });
}

// ---------------------
// AU CHARGEMENT, LOAD TOUTES LES PREMIÈRES VIDÉOS
// ---------------------
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    
    // ✅ Charge les premières vidéos de TOUTES les sections
    sections.forEach(section => {
        loadFirstSlideVideo(section);
    });
    
    console.log('✅ Scroll natif activé + toutes les premières vidéos chargées');
});

// ---------------------
// 🎥 LOAD LA PREMIÈRE VIDÉO DE CHAQUE SECTION
// ---------------------
function loadFirstSlideVideo(section) {
    const firstSlide = section.querySelector('.swiper-slide');
    if (!firstSlide) return;
    
    const container = firstSlide.querySelector('.video-container');
    if (!container || container.querySelector('video')) return;
    
    const isMobile = window.innerWidth <= 625;
    const src = isMobile ? container.dataset.srcMobile : container.dataset.srcDesktop;
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
    video.setAttribute('playsinline', 'true');
    video.controls = false;
    video.disablePictureInPicture = true;
    video.controlsList = 'nodownload nofullscreen noremoteplayback';
    video.className = isMobile ? 'format-bigo' : 'format-ordi';
    video.style.opacity = 0;
    video.style.pointerEvents = 'none';
    
    video.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    
    container.appendChild(video);
    
    setTimeout(() => {
        video.muted = true;
        video.play().catch(() => {
            console.log('Autoplay bloqué, retry sur interaction');
        });
    }, 100);

    video.addEventListener('loadeddata', () => {
        gsap.to(video, { opacity: 1, duration: 0.5, ease: "power2.out" });
        playVideo();
    }, { once: true });

    const playVideo = () => {
        video.play().catch(() => {
            const retry = () => video.play();
            document.addEventListener('touchstart', retry, { once: true });
            document.addEventListener('click', retry, { once: true });
        });
    };

    if (video.readyState >= 2) {
        playVideo();
    } else {
        video.addEventListener('canplay', playVideo, { once: true });
    }
}

window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        window.scrollTo(0, 0);
    }
});