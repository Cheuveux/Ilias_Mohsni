const alphabets = [
  'ILIASMOHSNI7@GMAIL.COM',
  'اٛلياﺱموشني@جمـيـل.كوم',
  'ｲﾘｱｽﾓｼﾆ@gﾒｲﾙ.ｺﾑ',
  'อิเลียสมอชนิ@จีเมล.คอม',
];

const anchor = document.querySelector('.multi-script');
let index = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;
let isHovered = false; // ← nouvel état pour hover

// ⚡ bloque l’effacement si la souris est dessus
anchor.addEventListener('mouseenter', () => isHovered = true);
anchor.addEventListener('mouseleave', () => isHovered = false);

function type() {
  if (isPaused) return;

  const current = alphabets[index];
  const displayed = current.substring(0, charIndex);
  anchor.innerHTML = displayed + '<span class="cursor">|</span>';

  if (!isDeleting && charIndex < current.length) {
    charIndex++;
    setTimeout(type, 30); // Plus rapide : 30ms au lieu de 50ms
  } else if (isDeleting && charIndex > 0) {
    if (!isHovered) { // ← ne supprime que si pas hover
      charIndex--;
    }
    setTimeout(type, 20); // Plus rapide : 20ms au lieu de 40ms
  } else {
    if (!isDeleting) {
      isDeleting = true;
      // Pause de 3s après l'écriture du mail latin (index 0), sinon petite pause de 500ms
      const pauseBeforeDelete = index === 0 ? 3000 : 500;
      setTimeout(type, pauseBeforeDelete);
    } else {
      isDeleting = false;
      index = (index + 1) % alphabets.length;

      // Pas de pause supplémentaire entre les alphabets
      setTimeout(() => {
        isPaused = false;
        type();
      }, 0);
    }
  }
}

// pause initiale 3s
setTimeout(() => type(), 3000);