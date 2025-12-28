// Submenu pour mobile uniquement
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 625;
    
    // Ne s'active que sur mobile
    if (!isMobile) return;

    const subMenuLinks = document.querySelectorAll('.submenu-element a');
    
    // Ajouter la classe active au premier lien (VIDEO-PRODUCTION) en fixe
    if (subMenuLinks.length > 0) {
        subMenuLinks[0].parentElement.classList.add('active');
    }

    subMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Scroll smooth natif sur mobile
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
