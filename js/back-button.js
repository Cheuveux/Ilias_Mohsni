// Script pour gérer le bouton retour des pages de détails
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('.icone-retour a');
  const isMobile = window.innerWidth <= 625;

  if (isMobile && backButton) {
    backButton.addEventListener('click', (e) => {
      // ✅ Marque que l'utilisateur est entré sur le site
      // pour éviter d'afficher le loader ENTER au retour
      sessionStorage.setItem('hasEnteredSite', 'true');
    });
  }
});
