const alphabets = [
    'iliasmohsni@gmail.com',
    'ιlιαѕмоѕhnі@gмαιl.coм',
    'іlіаѕмоѕhnі@gмаіl.coм',
    'اٛلياﺱموشني@جمـيـل.كوم',
    'ｲﾘｱｽﾓｼﾆ@gﾒｲﾙ.ｺﾑ',
    'อิเลียสมอชนิ@จีเมล.คอม',
];

const anchor = document.querySelector('.multi-script');

function wrapLetters(text) {
    return text.split('').map(c => `<span>${c}</span>`).join('');
}

let i = 0;
anchor.innerHTML = wrapLetters(alphabets[i]);

function changeAlphabet() {
    i = (i + 1) % alphabets.length;
    const newText = alphabets[i];
    const spans = anchor.querySelectorAll('span');

    newText.split('').forEach((char, idx) => {
        if (spans[idx]) {
            // délai aléatoire pour chaque lettre
            setTimeout(() => {
                spans[idx].textContent = char;
                spans[idx].style.color = ['#fff','#ccc','#aaa','#eee'][Math.floor(Math.random()*4)];
                spans[idx].style.transform = `translate(${Math.random()*10-2}px, ${Math.random()*10-2}px)`;
                setTimeout(() => { spans[idx].style.transform = 'translate(0,0)'; }, 150);
            }, idx * 70); // décalage progressif par index
        } else {
            anchor.innerHTML += `<span>${char}</span>`;
        }
    });
}

// Curseur clignotant (terminal)
anchor.insertAdjacentHTML('beforeend','<span class="cursor">|</span>');

setInterval(() => {
    changeAlphabet();
    anchor.setAttribute('data-text', alphabets[i]);
}, 1100);