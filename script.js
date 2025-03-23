const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
const bankrollElement = document.getElementById('player-bankroll');
const dealButton = document.getElementById("deal-button");

let cards = [];
let bankrollValue = 100;

bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;

values.forEach(value => {
  suits.forEach(suit => {
    cards.push(`cards/${value}_of_${suit}.svg`);
  });
});



dealButton.addEventListener("click", () => {
  shuffle(cards);
  dealCards();
  handleBets();
});

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatório de 0 a i
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Troca os elementos
  }
}

function dealCards() {
  let dealerCards = [];
  let playerCards = [];

  for (let i = 0; i < 3; i++) {
    playerCards.push(cards[i]);
    dealerCards.push(cards[i + 3]);
  }

  for (let i = 1; i <= 3; i++) {
    const dealerCard = document.getElementById(`dealer-card-${i}`);
    const playerCard = document.getElementById(`player-card-${i}`);

    dealerCard.src = `${dealerCards[i - 1]}`;
    playerCard.src = `${playerCards[i - 1]}`;
  }
}

function handleBets() {
  const inputValues = Array.from(document.querySelectorAll('input')).map(input => Number(input.value));

  bankrollValue -= inputValues.reduce((accumulator, value) => accumulator + value, 0); // Soma os valores dos inputs e subtrai do saldo
  bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;
}