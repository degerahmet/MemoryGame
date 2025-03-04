// ES6 Feature: Using const/let for block scoping
const state = {
    flippedCards: [],
    moves: 0,
    matches: 0,
    isLocked: false,
    startTime: null,
    timerInterval: null,
    totalPairs: 0,
    gridSize: 4
  };
  
  // Functional Programming: Pure function to generate card pairs
  const generateCards = size => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵', '🦄', '🦋', '🦀', '🐠', '🦕', '🦖', '🦎', '🐊', '🐢', '🐍', '🦜', '🦚', '🦩', '🦡', '🦨', '🦘'];
    const pairs = emojis.slice(0, (size * size) / 2);
    // ES6 Feature: Spread operator
    return [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isMatched: false }));
  };
  
  // DOM Manipulation: Creating card elements
  const createCardElement = (card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.index = index;
    
    cardElement.innerHTML = `
      <div class="card-face card-front">?</div>
      <div class="card-face card-back">${card.emoji}</div>
    `;
    
    return cardElement;
  };
  
  const updateStats = () => {
    document.getElementById('moves').textContent = state.moves;
    if (state.startTime && !state.timerInterval) {
      startTimer();
    }
  };
  
  const startTimer = () => {
    state.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      document.getElementById('timer').textContent = time;
    }, 1000);
  };
  
  // Event Handler: Card click handling
  const handleCardClick = (card, index) => {
    if (state.isLocked || state.flippedCards.includes(index) || 
        document.querySelector(`[data-index="${index}"]`).classList.contains('matched')) {
      return;
    }
  
    if (!state.startTime) {
      state.startTime = Date.now();
    }
  
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    cardElement.classList.add('flipped');
    state.flippedCards.push(index);
  
    if (state.flippedCards.length === 2) {
      state.moves++;
      updateStats();
      checkMatch();
    }
  };
  
  // Functional Programming: Pure function to check if game is complete
  const isGameComplete = () => state.matches === state.totalPairs;
  
  const checkMatch = () => {
    const [first, second] = state.flippedCards;
    const cards = document.querySelectorAll('.card');
    const firstCard = cards[first];
    const secondCard = cards[second];
    
    state.isLocked = true;
  
    if (firstCard.querySelector('.card-back').textContent === 
        secondCard.querySelector('.card-back').textContent) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      state.matches++;
      
      if (isGameComplete()) {
        endGame();
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
      }, 1000);
    }
  
    setTimeout(() => {
      state.flippedCards = [];
      state.isLocked = false;
    }, 1000);
  };
  
  const endGame = () => {
    clearInterval(state.timerInterval);
    const modal = document.getElementById('gameOver');
    document.getElementById('finalMoves').textContent = state.moves;
    document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
    modal.classList.add('visible');
  };
  
  const resetGame = () => {
    state.flippedCards = [];
    state.moves = 0;
    state.matches = 0;
    state.isLocked = false;
    state.startTime = null;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    document.getElementById('gameOver').classList.remove('visible');
    
    initializeGame(state.gridSize);
  };
  
  const initializeGame = (size) => {
    state.gridSize = size;
    state.totalPairs = (size * size) / 2;
    const grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = `repeat(${size}, var(--card-size))`;
    
    const cards = generateCards(size);
    grid.innerHTML = '';
    
    cards.forEach((card, index) => {
      const cardElement = createCardElement(card, index);
      // Event Listener: Adding click event to cards
      cardElement.addEventListener('click', () => handleCardClick(card, index));
      grid.appendChild(cardElement);
    });
  };
  
  // Event Listeners
  document.getElementById('playAgain').addEventListener('click', resetGame);
  document.getElementById('difficulty').addEventListener('change', (e) => {
    const size = parseInt(e.target.value);
    state.gridSize = size;
    resetGame();
  });
  
  // Initialize the game
  initializeGame(4);