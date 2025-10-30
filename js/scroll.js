let sections = gsap.utils.toArray("section");
let currentIndex = 0;
let isScrolling = false;

// Clone the first section for infinite scroll
if (sections.length > 0) {
    const firstSectionClone = sections[0].cloneNode(true);
    firstSectionClone.setAttribute('id', 'first-section-clone');
    sections[sections.length - 1].parentNode.appendChild(firstSectionClone);
    sections = gsap.utils.toArray("section"); // update sections array
}

// Function to scroll to a given section index using window scroll
function scrollToSection(index) {
    if (!isScrolling && sections.length > 0) {
        isScrolling = true;
        index = Math.max(0, Math.min(index, sections.length - 1)); // clamp index

        let targetSection = sections[index];
        // Calculate the top position of the target section relative to the document
        const targetPosition = targetSection.offsetTop;

        gsap.to(window, {
            scrollTo: { y: targetPosition, autoKill: false },
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                if (index === sections.length - 1) {
                    // Smooth loop: jump to the real first section
                    gsap.delayedCall(0.05, () => {
                        window.scrollTo(0, sections[0].offsetTop);
                        currentIndex = 0;
                        ScrollTrigger.refresh();

                        // Immediately reset the first section title to avoid latency
                        const firstTitle = sections[0].querySelector('.title-section');
                        if(firstTitle){
                            gsap.set(firstTitle, { left: '5%', opacity: 1.5 });
                        }
                        isScrolling = false;
                    });
                } else {
                    currentIndex = index;
                    isScrolling = false;
                }
            }
        });
    }
}

// Handle wheel events for vertical scrolling on window
window.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // ignore mostly horizontal scroll
    if (sections.length === 0) return;

    if (e.deltaY > 0) scrollToSection(currentIndex + 1);
    else if (e.deltaY < 0) scrollToSection(currentIndex - 1);
});

// Handle keyboard arrows on window
window.addEventListener("keydown", (e) => {
    if(isScrolling || sections.length === 0) return;
    if(e.key === "ArrowDown") scrollToSection(currentIndex + 1);
    if(e.key === "ArrowUp") scrollToSection(currentIndex - 1);
});
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, {passive: true});

window.addEventListener('touchmove', (e) =>{
    touchEndY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touched', () => {
    if(isScrolling || sections.length === 0)
        return;
    const deltaY = touchStartY - touchEndY;
    if(Math.abs(deltaY) < 50)
        return;
    if(deltaY > 0)
        scrollToSection(currentIndex + 1);
    else
        scrollToSection(currentIndex - 1);
});

gsap.registerPlugin(ScrollTrigger);

// Animate titles in sections with default scroller (window)
sections.forEach((section, index) => {
    const title = section.querySelector('.title-section');
    if(title){
        const sectionWidth = 100 / (sections.length - 1);
        const leftTarget = index * sectionWidth;

        if(index === 0){
            // Initial first section title
            gsap.set(title, { left: '5%', opacity: 1.5 });
            gsap.to(title, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true,
                    onEnterBack: () => gsap.set(title, { left: '5%', opacity: 1.5 })
                }
            });
        } else {
            gsap.fromTo(title,
                { left: '5%', opacity: 0 },
                {
                    left: `${leftTarget}%`,
                    opacity: 1.5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: true
                    }
                }
            );
        }
    }
});

// IntersectionObserver for autoplay/pause of all videos
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.play();
            else {
                entry.target.pause();
                entry.target.currentTime = 0;
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(video => {
        video.pause();
        observer.observe(video);
    });
});

// Animate sections on page load
document.addEventListener("DOMContentLoaded", () => {
    gsap.from("main section", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2
    });
});

/*
  === Pistes d'amélioration ===
  1. Utiliser ScrollTrigger.batch() pour les titres et sections afin de réduire les recalculs et améliorer la fluidité.
  2. Throttler les événements wheel pour éviter les triggers multiples rapides.
  3. Ajouter une détection responsive pour gérer la hauteur dynamique des sections ou des vidéos.
  4. Possibilité de gérer le clone de section avec un wrapper invisible pour éviter tout effet de "jump".
  5. Optimiser les IntersectionObserver thresholds selon la taille réelle des vidéos pour réduire les pauses/restarts inutiles.
*/