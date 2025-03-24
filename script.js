const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
const bankrollElement = document.getElementById('player-bankroll');
const images = document.querySelectorAll('img');
const dealButton = document.getElementById('deal-button');
const playButton = document.getElementById('play-button');
const foldButton = document.getElementById('fold-button');

let cards = [];
let dealerCards;
let playerCards;
let bankrollValue = 100;
let choseToPlay;

bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;

values.forEach(value => {
  suits.forEach(suit => {
    cards.push(`cards/${value}_of_${suit}.svg`);
  });
});

images.forEach(image => {
  image.src = 'cards/card-back.png';
});

dealButton.addEventListener('click', startHand);

playButton.addEventListener('click', () => {
  handlePlayBet();
  choseToPlay = true;
  endHand();
});

foldButton.addEventListener('click', () => {
  choseToPlay = false;
  endHand();
});

function startHand() {
  dealButton.style.display = 'none';
  playButton.style.display = 'block';
  foldButton.style.display = 'block';

  shuffleCards();
  dealCards();
  handleBets();
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatório de 0 a i
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Troca os elementos
  }
}

function dealCards() {
  dealerCards = [];
  playerCards = [];

  for (let i = 0; i < 3; i++) {
    playerCards.push(cards[i]);
    dealerCards.push(cards[i + 3]);
  }

  for (let i = 1; i <= 3; i++) {
    const playerCard = document.getElementById(`player-card-${i}`);
    playerCard.src = `${playerCards[i - 1]}`;
  }
}

function handleBets() {
  const inputs = Array.from(document.querySelectorAll('input'));
  const inputValues = inputs.map(input => Number(input.value));

  bankrollValue -= inputValues.reduce((accumulator, value) => accumulator + value, 0); // Soma os valores dos inputs e subtrai do saldo
  bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;

  inputValues.forEach((value, index) => {
    const betId = inputs[index].parentElement.id.replace('value', 'bet');
    const betChip = document.querySelector(`#${betId} .chip`);

    if (value > 0) {
      betChip.innerText = value;
      betChip.style.display = 'flex';
    } else {
      betChip.style.display = 'none';
    }
  });
}

function handlePlayBet() {
  const betChip = document.querySelector('#play-bet .chip');
  const betValue = document.querySelector('#ante-bet .chip').innerText;

  betChip.innerText = betValue;
  betChip.style.display = 'flex';

  bankrollValue -= Number(betValue);
  bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;
}

function endHand() {
  for (let i = 1; i <= 3; i++) {
    const dealerCard = document.getElementById(`dealer-card-${i}`);
    dealerCard.src = `${dealerCards[i - 1]}`;
  }
}