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
                const href = link.getAttribute('href');
                // Si c'est une ancre (#...) ou une section du site, on bloque le comportement par défaut
                // Sinon (ex: comingSoon.html), on laisse le lien s'ouvrir normalement
                if (href && (href.startsWith('#') || href === 'index.html' || href === 'about.html' || href === 'contact.html')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                // Si href est autre chose (ex: comingSoon.html), on laisse le lien fonctionner normalement
            });
    });
});
