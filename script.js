const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
const referenceArray = ['2', '3', 'ace']; // Referência para um A-2-3 Straight
const rankingOrder = ['High Card', 'Pair', 'Flush', 'Straight', 'Three Of A Kind', 'Straight Flush', 'Mini Royal Flush'];
const bankrollElement = document.getElementById('player-bankroll');
const images = document.querySelectorAll('img');
const dealButton = document.getElementById('deal-button');
const playButton = document.getElementById('play-button');
const foldButton = document.getElementById('fold-button');
const betValuesDiv = document.getElementById('bet-values');
const handResultDiv = document.getElementById('hand-result');

// Payout Tables
const pairPlus = {
  miniRoyalFlush: 200,
  straightFlush: 40,
  threeOfAKind: 30,
  straight: 6,
  flush: 3,
  pair: 1
};
const anteBonus = {
  straightFlush: 5,
  threeOfAKind: 4,
  straight: 1
};
const sixCardBonus = {
  royalFlush: 1000,
  straightFlush: 200,
  fourOfAKind: 50,
  fullHouse: 25,
  flush: 15,
  straight: 10,
  threeOfAKind: 5
};

let cards = [];
let dealerCards;
let playerCards;
let inputs;
let inputValues; // [ante, pair plus, 6 card bonus]
let dealerHandInfo;
let playerHandInfo;
let bankrollValue = 100;
let choseToPlay;
let winner;

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
  betValuesDiv.style.display = 'none';
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
  inputs = Array.from(document.querySelectorAll('input'));
  inputValues = inputs.map(input => Number(input.value));

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
  determineWinner();
  handlePayouts();
}

function determineWinner() {
  playButton.style.display = 'none';
  foldButton.style.display = 'none';

  // Info: [cardValues, ranking]
  dealerHandInfo = rankHand(dealerCards);
  playerHandInfo = rankHand(playerCards);

  for (let i = 1; i <= 3; i++) {
    const dealerCard = document.getElementById(`dealer-card-${i}`);
    dealerCard.src = `${dealerCards[i - 1]}`;
  }

  if (dealerHandInfo[1] === playerHandInfo[1]) {
    winner = rankSameHands();
  } else {
    if (rankingOrder.indexOf(dealerHandInfo[1]) > rankingOrder.indexOf(playerHandInfo[1])) {
      winner = 'Dealer';
    } else {
      winner = 'Player';
    }
  }

  if (winner === 'Tie') {
    handResultDiv.innerHTML = `
      <p>Dealer: ${dealerHandInfo[1]}</p>
      <p>Player: ${playerHandInfo[1]}</p>
      <p>Tie!</p>
    `;
  } else {
    handResultDiv.innerHTML = `
      <p>Dealer: ${dealerHandInfo[1]}</p>
      <p>Player: ${playerHandInfo[1]}</p>
      <p>${winner} wins!</p>
    `;
  }
}

function rankHand(hand) {
  let cardValues;
  let cardSuits;
  let cardPairs = [];
  let ranking;

  hand.forEach(card => {
    const cardParts = card.replace('cards/', '').replace('.svg', '').split('_of_');
    const cardValue = cardParts[0];
    const cardSuit = cardParts[1];

    cardPairs.push([cardValue, cardSuit]);
  });

  cardPairs.sort((a, b) => values.indexOf(a[0]) - values.indexOf(b[0]));
  cardValues = cardPairs.map(card => card[0]);
  cardSuits = cardPairs.map(card => card[1]);

  if (cardValues[0] === 'queen' &&
      cardValues[1] === 'king' &&
      cardValues[2] === 'ace' &&
      cardSuits.every(suit => suit === cardSuits[0])) {
    ranking = 'Mini Royal Flush';
  }

  else if ((values.indexOf(cardValues[1]) === values.indexOf(cardValues[0]) + 1 &&
            values.indexOf(cardValues[2]) === values.indexOf(cardValues[1]) + 1 ||
            cardValues.every((value, index) => value === referenceArray[index])) &&
            cardSuits.every(suit => suit === cardSuits[0])) {
    ranking = 'Straight Flush';
  }
  
  else if (cardValues.every(value => value === cardValues[0])) {
    ranking = 'Three Of A Kind';
  }

  else if (values.indexOf(cardValues[1]) === values.indexOf(cardValues[0]) + 1 &&
           values.indexOf(cardValues[2]) === values.indexOf(cardValues[1]) + 1 ||
           cardValues.every((value, index) => value === referenceArray[index])) {
    ranking = 'Straight';
  }

  else if (cardSuits.every(suit => suit === cardSuits[0])) {
    ranking = 'Flush';
  }

  else if (values.indexOf(cardValues[1]) === values.indexOf(cardValues[0]) ||
           values.indexOf(cardValues[2]) === values.indexOf(cardValues[1])) {
    ranking = 'Pair';
  }

  else {
    ranking = 'High Card';
  }

  return [cardValues, ranking];
}

function rankSameHands() {
  const ranking = dealerHandInfo[1];

  if (ranking === 'Mini Royal Flush') return 'Tie';

  if (['Straight Flush', 'Three-of-a-Kind', 'Straight'].includes(ranking)) {
    const dealerValue = dealerHandInfo[0].every((value, index) => value === referenceArray[index]) ? 1 : values.indexOf(dealerHandInfo[0][2]);
    const playerValue = playerHandInfo[0].every((value, index) => value === referenceArray[index]) ? 1 : values.indexOf(playerHandInfo[0][2]);
    
    if (dealerValue > playerValue) return 'Dealer';
    if (dealerValue < playerValue) return 'Player';
    
    return 'Tie';
  }

  if (['Flush', 'High Card'].includes(ranking)) {
    for (let i = 2; i >= 0; i--) {
      const dealerValue = values.indexOf(dealerHandInfo[0][i]);
      const playerValue = values.indexOf(playerHandInfo[0][i]);
    
      if (dealerValue > playerValue) return 'Dealer';
      if (dealerValue < playerValue) return 'Player';
    }
    
    return 'Tie';    
  }

  // Pair
  const dealerValue = values.indexOf(dealerHandInfo[0].find(value => dealerHandInfo[0].indexOf(value) !== dealerHandInfo[0].lastIndexOf(value)));
  const playerValue = values.indexOf(playerHandInfo[0].find(value => playerHandInfo[0].indexOf(value) !== playerHandInfo[0].lastIndexOf(value)));
  
  let dealerKicker;
  let playerKicker;

  if (dealerValue > playerValue) return 'Dealer';
  if (dealerValue < playerValue) return 'Player';

  dealerKicker = values.indexOf(dealerHandInfo[0].find(value => dealerHandInfo[0].indexOf(value) === dealerHandInfo[0].lastIndexOf(value)));
  playerKicker = values.indexOf(playerHandInfo[0].find(value => playerHandInfo[0].indexOf(value) === playerHandInfo[0].lastIndexOf(value)));

  if (dealerKicker > playerKicker) return 'Dealer';
  if (dealerKicker < playerKicker) return 'Player';

  return 'Tie';
}

function handlePayouts() {
  const anteValue = inputValues[0];
  const pairPlusValue = inputValues[1];
  const sixCardBonusValue = inputValues[2];

  // Ante/Play
  if (choseToPlay) {
    if (values.indexOf(dealerHandInfo[0][2]) >= 10 || dealerHandInfo[1] !== 'High Card') { // Dealer se qualifica
      if (winner === 'Player') {
        bankrollValue += 4 * anteValue;
      } else if (winner === 'Tie') {
        bankrollValue += 2 * anteValue;
      }
    } else {
      bankrollValue += 3 * anteValue;
    }
  }

  // Pair Plus
  if (playerHandInfo[1] !== 'High Card' && pairPlusValue > 0) {
    let ranking;
    let multiplier;

    ranking = playerHandInfo[1].replaceAll(' ', '');
    ranking = ranking.charAt(0).toLowerCase() + ranking.slice(1);
    multiplier = pairPlus[`${ranking}`];
    bankrollValue += pairPlusValue + multiplier * pairPlusValue;
  }

  bankrollElement.innerHTML = `<p>Bankroll: ${bankrollValue}</p>`;
}