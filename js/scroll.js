// Sélection des sections
let sections = gsap.utils.toArray("section");
let currentIndex = 0;
let isScrolling = false;
let initialScrollCaptured = false;

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
let wheelTimeout;
window.addEventListener("wheel", (e) => {
    if (isScrolling || sections.length === 0) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    if (wheelTimeout) return;
    wheelTimeout = setTimeout(() => wheelTimeout = null, 200);

    if (e.deltaY > 0) scrollToSection(currentIndex + 1);
    else if (e.deltaY < 0) scrollToSection(currentIndex - 1);
});

// ---------------------
// 📱 GESTION DU TOUCH MOBILE
// ---------------------
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    // Empêche le scroll natif pendant les transitions
    if (isScrolling) e.preventDefault();
    touchEndY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchend', () => {
    if (isScrolling || sections.length === 0) return;
    const deltaY = touchStartY - touchEndY;
    if (Math.abs(deltaY) < 20) return; // sensibilité augmentée
    if (deltaY > 0) scrollToSection(currentIndex + 1);
    else scrollToSection(currentIndex - 1);
});

// ---------------------
// ⌨️ GESTION DU CLAVIER ORDINATEUR
// ---------------------
window.addEventListener('keydown', (e) => {
    if (isScrolling || sections.length === 0) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        scrollToSection(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        scrollToSection(currentIndex - 1);
    }
});

// Scroll fluide avec GSAP
function scrollToSection(index) {
  if (isScrolling || sections.length === 0) return;

  isScrolling = true;
  disableScroll();
  index = Math.max(0, Math.min(index, sections.length - 1));

  // Si on relance depuis une position autre que le haut, ignore le jump
  if (index === 0 && initialScrollCaptured) {
      enableScroll();
      isScrolling = false;
      return;
  }

  const targetSection = sections[index];
  const targetPosition = targetSection.offsetTop;

  gsap.to(window, {
      scrollTo: { y: targetPosition, autoKill: false },
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
          if (index === sections.length - 1) {
              // Boucle fluide
              gsap.delayedCall(0.05, () => {
                  window.scrollTo(0, sections[0].offsetTop);
                  currentIndex = 0;
                  ScrollTrigger.refresh();
                  enableScroll();
                  isScrolling = false;
              });
          } else {
              currentIndex = index;
              enableScroll();
              isScrolling = false;
          }
      }
  });
}