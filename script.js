// Game state
let gameState = {
  players: [],
  currentRound: 1,
  gameInProgress: false
};

// DOM elements
const gameSetupElement = document.getElementById('gameSetup');
const gamePlayElement = document.getElementById('gamePlay');
const scoreSummaryElement = document.getElementById('scoreSummary');
const resultsElement = document.getElementById('results');
const roundScoresElement = document.getElementById('roundScores');
const summaryScoresElement = document.getElementById('summaryScores');
const currentRoundElement = document.getElementById('currentRound');
const addPlayerButton = document.getElementById('addPlayer');
const startGameButton = document.getElementById('startGame');
const nextRoundButton = document.getElementById('nextRound');
const newGameButton = document.getElementById('newGame');
const themeToggleButton = document.getElementById('themeToggle');

// Event listeners
document.addEventListener('DOMContentLoaded', initApp);
addPlayerButton.addEventListener('click', addPlayerInput);
startGameButton.addEventListener('click', startGame);
nextRoundButton.addEventListener('click', nextRound);
newGameButton.addEventListener('click', resetGame);
themeToggleButton.addEventListener('click', toggleTheme);

// Initialize the application
function initApp() {
  resetGame();
  loadTheme();
}

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const isDarkMode = body.classList.contains('dark-mode');
  
  if (isDarkMode) {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggleButton.querySelector('.toggle-icon').textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggleButton.querySelector('.toggle-icon').textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme or use default
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const body = document.body;
  
  if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeToggleButton.querySelector('.toggle-icon').textContent = '☀️';
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeToggleButton.querySelector('.toggle-icon').textContent = '🌙';
  }
}

// Add a new player input field
function addPlayerInput() {
  const playerInputs = document.querySelector('.player-inputs');
  const playerCount = playerInputs.children.length + 1;
  
  if (playerCount > 8) {
    alert('Maximum 8 players allowed');
    return;
  }
  
  const playerInput = document.createElement('div');
  playerInput.className = 'player-input';
  playerInput.innerHTML = `
    <label for="player${playerCount}">Player ${playerCount}</label>
    <input type="text" id="player${playerCount}" placeholder="Name" required>
  `;
  
  playerInputs.appendChild(playerInput);
}

// Start a new game
function startGame() {
  // Get player names from input fields
  const playerInputs = document.querySelectorAll('.player-inputs input');
  const players = [];
  
  let validInputs = true;
  
  playerInputs.forEach((input, index) => {
    const name = input.value.trim();
    if (!name) {
      validInputs = false;
      input.focus();
      alert(`Please enter a name for Player ${index + 1}`);
      return;
    }
    
    players.push({
      id: index + 1,
      name: name,
      scores: [0, 0, 0, 0, 0],
      total: 0
    });
  });
  
  if (!validInputs) return;
  if (players.length < 2) {
    alert('At least 2 players are required');
    return;
  }
  
  // Set game state
  gameState = {
    players: players,
    currentRound: 1,
    gameInProgress: true
  };
  
  // Show game play view
  showView('gamePlay');
  updateGamePlayView();
}

// Move to the next round
function nextRound() {
  // Validate all scores are entered
  const scoreInputs = document.querySelectorAll('.score-input');
  let allScoresEntered = true;
  
  scoreInputs.forEach(input => {
    if (input.value.trim() === '') {
      allScoresEntered = false;
      input.focus();
      alert('Please enter all scores');
      return;
    }
  });
  
  if (!allScoresEntered) return;
  
  // Update player scores for the current round
  scoreInputs.forEach((input, index) => {
    const playerId = parseInt(input.getAttribute('data-player-id'));
    const score = parseInt(input.value);
    
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
      player.scores[gameState.currentRound - 1] = score;
    }
  });
  
  // Apply special rule: player with lowest score in the round (if > 0) gets score set to 0
  applySpecialRule();
  
  // Update total scores
  updateTotalScores();
  
  // Show score summary
  updateScoreSummary();
  showView('scoreSummary');
  
  // Check if game is complete
  if (gameState.currentRound === 5) {
    // Game is complete, show results
    showResults();
  } else {
    // Move to the next round
    gameState.currentRound++;
    
    // Add a continue button that takes us back to the game play view
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue to Round ' + gameState.currentRound;
    continueButton.className = 'btn btn-primary';
    continueButton.style.marginTop = '1rem';
    continueButton.onclick = function() {
      showView('gamePlay');
      updateGamePlayView();
      scoreSummaryElement.querySelector('.buttons')?.remove();
    };
    
    // Create a container for the button if it doesn't exist
    let buttonsContainer = scoreSummaryElement.querySelector('.buttons');
    if (!buttonsContainer) {
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'buttons';
      scoreSummaryElement.appendChild(buttonsContainer);
    } else {
      buttonsContainer.innerHTML = '';
    }
    
    buttonsContainer.appendChild(continueButton);
  }
}

// Apply the special rule: all players with the lowest score in the round (if > 0) get their score set to 0
function applySpecialRule() {
  const currentRoundIndex = gameState.currentRound - 1;
  
  // Get all scores > 0 for the current round
  const positivePlayers = gameState.players.filter(player => player.scores[currentRoundIndex] > 0);
  
  if (positivePlayers.length > 0) {
    // Find the lowest score in current round
    let lowestScore = positivePlayers[0].scores[currentRoundIndex];
    positivePlayers.forEach(player => {
      if (player.scores[currentRoundIndex] < lowestScore) {
        lowestScore = player.scores[currentRoundIndex];
      }
    });
    
    // Set all players with the lowest score to 0
    positivePlayers.forEach(player => {
      if (player.scores[currentRoundIndex] === lowestScore) {
        player.scores[currentRoundIndex] = 0;
      }
    });
  }
}

// Update total scores for all players
function updateTotalScores() {
  gameState.players.forEach(player => {
    player.total = player.scores.reduce((sum, score) => sum + score, 0);
  });
}

// Update the game play view for the current round
function updateGamePlayView() {
  // Update round number
  currentRoundElement.textContent = gameState.currentRound;
  
  // Clear existing scores
  roundScoresElement.innerHTML = '';
  
  // Add score inputs for each player
  gameState.players.forEach(player => {
    const row = document.createElement('tr');
    
    // Player name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = player.name;
    row.appendChild(nameCell);
    
    // Score input cell
    const scoreCell = document.createElement('td');
    const scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.min = '0';
    scoreInput.className = 'score-input';
    scoreInput.setAttribute('data-player-id', player.id);
    scoreCell.appendChild(scoreInput);
    row.appendChild(scoreCell);
    
    // Filler cell for consistent layout
    const actionCell = document.createElement('td');
    row.appendChild(actionCell);
    
    roundScoresElement.appendChild(row);
  });
}

// Update the score summary view
function updateScoreSummary() {
  // Clear existing summary
  summaryScoresElement.innerHTML = '';
  
  // Add rows for each player
  gameState.players.forEach(player => {
    const row = document.createElement('tr');
    
    // Player name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = player.name;
    row.appendChild(nameCell);
    
    // Cells for each round score
    player.scores.forEach((score, index) => {
      const scoreCell = document.createElement('td');
      // Only show scores up to the current round
      if (index < gameState.currentRound) {
        scoreCell.textContent = score;
      }
      row.appendChild(scoreCell);
    });
    
    // Total score cell
    const totalCell = document.createElement('td');
    totalCell.textContent = player.total;
    totalCell.className = 'total-score';
    row.appendChild(totalCell);
    
    summaryScoresElement.appendChild(row);
  });
}

// Show the results view
function showResults() {
  // Sort players by total score (ascending)
  const sortedPlayers = [...gameState.players].sort((a, b) => a.total - b.total);
  
  // Get winner (lowest score) and loser (highest score)
  const winner = sortedPlayers[0];
  const loser = sortedPlayers[sortedPlayers.length - 1];
  
  // Update winner display
  const winnerNameElement = document.querySelector('#winnerDisplay .player-name');
  const winnerScoreElement = document.querySelector('#winnerDisplay .score');
  winnerNameElement.textContent = winner.name;
  winnerScoreElement.textContent = winner.total;
  
  // Update loser display
  const loserNameElement = document.querySelector('#loserDisplay .player-name');
  const loserScoreElement = document.querySelector('#loserDisplay .score');
  loserNameElement.textContent = loser.name;
  loserScoreElement.textContent = loser.total;
  
  // Add all players results
  const allResultsContainer = document.getElementById('allPlayersResults');
  allResultsContainer.innerHTML = ''; // Clear previous results
  
  sortedPlayers.forEach((player, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-result-item';
    
    // Add position indicator
    const position = index + 1;
    let positionClass = '';
    if (position === 1) positionClass = 'winner-position';
    else if (position === sortedPlayers.length) positionClass = 'loser-position';
    
    playerDiv.innerHTML = `
      <div class="position ${positionClass}">${position}</div>
      <div class="player-info">
        <div class="player-name-small">${player.name}</div>
        <div class="player-rounds">
          ${player.scores.map(score => `<span class="round-score">${score}</span>`).join('')}
        </div>
      </div>
      <div class="player-total">${player.total}</div>
    `;
    
    allResultsContainer.appendChild(playerDiv);
  });
  
  // Show results view
  showView('results');
}

// Reset the game
function resetGame() {
  // Reset game state
  gameState = {
    players: [],
    currentRound: 1,
    gameInProgress: false
  };
  
  // Reset player inputs
  const playerInputs = document.querySelector('.player-inputs');
  playerInputs.innerHTML = `
    <div class="player-input">
      <label for="player1">Player 1</label>
      <input type="text" id="player1" placeholder="Name" required>
    </div>
    <div class="player-input">
      <label for="player2">Player 2</label>
      <input type="text" id="player2" placeholder="Name" required>
    </div>
  `;
  
  // Show game setup view
  showView('gameSetup');
}

// Show a specific view and hide others
function showView(viewId) {
  // Hide all views
  gameSetupElement.classList.add('hidden');
  gamePlayElement.classList.add('hidden');
  scoreSummaryElement.classList.add('hidden');
  resultsElement.classList.add('hidden');
  
  // Show the requested view
  document.getElementById(viewId).classList.remove('hidden');
}