let sections = gsap.utils.toArray("section");
let currentIndex = 0;
let isScrolling = false;
let initialScrollCaptured = false; // flag pour ignorer le jump initial

// Clone first section for infinite scroll
if (sections.length > 0) {
    const firstSectionClone = sections[0].cloneNode(true);
    firstSectionClone.setAttribute('id', 'first-section-clone');
    sections[sections.length - 1].parentNode.appendChild(firstSectionClone);
    sections = gsap.utils.toArray("section");
}

// Capture initial scroll position on load
window.addEventListener('load', () => {
    if(window.scrollY > 0) {
        initialScrollCaptured = true;
        // find the section nearest to scrollY
        for(let i = 0; i < sections.length; i++){
            if(window.scrollY < sections[i].offsetTop + sections[i].offsetHeight){
                currentIndex = i;
                break;
            }
        }
    }
});

// Smooth scroll function
function scrollToSection(index) {
    if (!isScrolling && sections.length > 0) {
        isScrolling = true;
        index = Math.max(0, Math.min(index, sections.length - 1));

        // Skip jump to first section if initial scroll captured
        if(index === 0 && initialScrollCaptured) {
            isScrolling = false;
            return;
        }

        const targetSection = sections[index];
        const targetPosition = targetSection.offsetTop;

        gsap.to(window, {
            scrollTo: { y: targetPosition, autoKill: false },
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                if (index === sections.length - 1) {
                    // Smooth loop
                    gsap.delayedCall(0.05, () => {
                        window.scrollTo(0, sections[0].offsetTop);
                        currentIndex = 0;
                        ScrollTrigger.refresh();
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

// Wheel event with throttling
let wheelTimeout;
window.addEventListener("wheel", (e) => {
    if(isScrolling || sections.length === 0) return;
    if(Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    if(wheelTimeout) return;
    wheelTimeout = setTimeout(() => wheelTimeout = null, 200);

    if(e.deltaY > 0) scrollToSection(currentIndex + 1);
    else if(e.deltaY < 0) scrollToSection(currentIndex - 1);
});

// Touch events (mobile)
let touchStartY = 0;
let touchEndY = 0;
window.addEventListener('touchstart', (e) => touchStartY = e.touches[0].clientY, {passive:true});
window.addEventListener('touchmove', (e) => touchEndY = e.touches[0].clientY, {passive:true});
window.addEventListener('touchend', () => {
    if(isScrolling || sections.length === 0) return;
    const deltaY = touchStartY - touchEndY;
    if(Math.abs(deltaY) < 50) return;
    if(deltaY > 0) scrollToSection(currentIndex + 1);
    else scrollToSection(currentIndex - 1);
});