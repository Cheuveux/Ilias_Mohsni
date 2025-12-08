//Animation hover
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('mouseenter', () => {
      if(!link.classList.contains("active")){
        anime({
        targets: link,
        color: '#B03A2E',
        letterSpacing: "6px",
        duration: 600,
        easing: 'easeOutExpo'
      });
      }
    });
    link.addEventListener('mouseleave', () => {
      if(!link.classList.contains("active")){
        anime({
        targets: link,
        color: 'rgb(222, 221, 201)',
        letterSpacing: '0px',
        scaleX : 1,
        duration: 600,
        easing: 'easeOutExpo'
      });
      }
    });
  });

//ajout de la classe active pour la page courante
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-item");
  const currentPage = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute("href");
    const linkPath = new URL(href, window.location.origin).pathname;
    if (currentPage.endsWith(linkPath)) {
      link.classList.add("active");
    }
  });

  //anim du lien actif
const activeLink = document.querySelector('.nav-item.active');
if(activeLink){
  anime ({
    targets: activeLink,
    translateX: ['120%', '0%'],
    opacity: [0, 1],
    duration: 1050,
    easing: 'easeOutExpo'
  });
}

// ✅ Sur mobile : clic sur Work ramène en haut de la page
const workLink = document.querySelector('.nav-item[href="index.html"]');
if (workLink && window.innerWidth <= 625) {
  workLink.addEventListener('click', (e) => {
    // Toujours ramener en haut sur mobile quand on clique sur Work
    e.preventDefault();
    
    // Si on est sur une autre page, redirige vers index.html
    if (!currentPage.endsWith('index.html') && currentPage !== '/') {
      window.location.href = 'index.html';
    } else {
      // Si déjà sur index.html, scroll vers le haut
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}
});



