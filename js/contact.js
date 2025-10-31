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
    setTimeout(type, 100);
  } else if (isDeleting && charIndex > 0) {
    if (!isHovered) { // ← ne supprime que si pas hover
      charIndex--;
    }
    setTimeout(type, 40);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(type, 1200);
    } else {
      isDeleting = false;
      index = (index + 1) % alphabets.length;

      const pauseTime = index === 0 ? 3000 : 0;
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        type();
      }, 3000 + pauseTime);
    }
  }
}

// pause initiale 3s
setTimeout(() => type(), 3000);