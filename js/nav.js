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
if (window.innerWidth <= 625) {
  console.log('📱 Mode mobile détecté, setup scroll to top pour Work');
  
  const workLinks = document.querySelectorAll('.nav-item');
  workLinks.forEach(link => {
    // Cherche le lien qui contient "Work" dans le texte
    if (link.textContent.trim().toLowerCase() === 'work') {
      console.log('✅ Lien Work trouvé:', link);
      
      link.addEventListener('click', (e) => {
        console.log('👆 Clic sur Work détecté');
        console.log('Current page:', currentPage);
        
        // Si on est déjà sur index.html
        if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
          console.log('⬆️ Scroll vers le haut');
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }
  });
}
});



