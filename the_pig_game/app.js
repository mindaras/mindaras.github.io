/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, diceDOM, gamePlaying, sixCounter, scoreToWin, dicesCount;

dice1DOM = document.querySelector('.dice-1');
dice2DOM = document.querySelector('.dice-2');

// initialize the game
init();


// EVENT LISTENERS

// roll
document.querySelector('.btn-roll').addEventListener('click', function() {
  if (gamePlaying) {
    // dice 1 number
    var dice1 = Math.floor(Math.random() * 6) + 1;

    // hide the score choice
    document.getElementById('score-choice').style.display = 'none';
    document.querySelector('.btn-score').style.display = 'none';
    // hide the dices choice
    document.querySelector('.radio-wrapper').style.display = 'none';
    document.querySelector('.radio-wrapper.second').style.display = 'none';

    // display the dice
    dice1DOM.style.display = 'block';
    dice1DOM.src = 'dice-' + dice1 + '.png';

    if (dicesCount === 2) {
      // dice 2 number
      var dice2 = Math.floor(Math.random() * 6) + 1;
      // display the dice
      dice2DOM.style.display = 'block';
      dice2DOM.src = 'dice-' + dice2 + '.png';
    } else {
      var dice2 = 0;
    }

    if (dice1 !== 1 && dice2 !== 1) {
      roundScore += dice1 + dice2;
      document.getElementById('current-' + activePlayer).textContent = roundScore;

      if (dicesCount === 1) {
          // if rolled two 6 in a row reset the global score and change turn
         if (dice1 === 6 && sixCounter === 1) {
           // reset the counter
           sixCounter = 0;
           // reset the global score
           scores[activePlayer] = 0;
           // update the ui
           document.getElementById('score-' + activePlayer).textContent = 0;
           // change turn
           nextPlayer();
         } else if (dice1 === 6) {
           // if previous dice was not 6 increase the six counter
           sixCounter += 1;
         } else {
           // if the dice is not 6 reset the counter
           sixCounter = 0;
         }
      }

    } else {
      // next player
      nextPlayer();
    }
  }
});

// hold
document.querySelector('.btn-hold').addEventListener('click', function() {
  if (gamePlaying) {
    // add current score to global score
    scores[activePlayer] += roundScore;

    // update the ui
    document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

    // check if player won the game
    if (scores[activePlayer] >= scoreToWin) {
      document.getElementById('name-' + activePlayer).textContent = 'Winner!'
      document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
      dice1DOM.style.display = 'none';
      dice2DOM.style.display = 'none';
      gamePlaying = false;
    } else {
      // next player
      nextPlayer();
    }
  }
});

// new game
document.querySelector('.btn-new').addEventListener('click', init);

// user score to win choice
document.querySelector('.btn-score').addEventListener('click', function() {
  var userChoice = document.getElementById('score-choice').value;

  // if user's choice is more than 0 setting the new score to win the game
  if (userChoice > 1 && userChoice !== '') {
    scoreToWin = userChoice;
    // hiding the choice field
    document.getElementById('score-choice').style.display = 'none';
    document.querySelector('.btn-score').style.display = 'none';
  }
});

// number of dices choice
var radioButtons = document.querySelectorAll('.radio');

// change the dices count
for (var i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener('click', function() {
    dicesCount = parseInt(this.value);
  });
}


// FUNCTIONS

// next player
function nextPlayer() {
  // reset roundscore
  roundScore = 0;
  // reset six counter
  sixCounter = 0;

  // remove all the score from the active player
  document.getElementById('current-' + activePlayer).textContent = 0;

  // change the active player
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

  // change the active player class
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  // hide the dice
  dice1DOM.style.display = 'none';
  dice2DOM.style.display = 'none';
}

// initialize the game
function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;
  sixCounter = 0;
  scoreToWin = 100;
  dicesCount = 1;

  document.querySelector('.dice-1').style.display = 'none';
  document.querySelector('.dice-2').style.display = 'none';
  document.querySelector('.btn-score').style.display = 'block';
  document.querySelector('.radio-wrapper').style.display = 'block';
  document.querySelector('.radio-wrapper.second').style.display = 'block';
  document.getElementById('score-choice').style.display = 'block';

  document.querySelector('.radio-1').checked = true;

  document.getElementById('score-choice').value = '';
  document.getElementById('score-0').textContent = 0;
  document.getElementById('score-1').textContent = 0;
  document.getElementById('current-0').textContent = 0;
  document.getElementById('current-1').textContent = 0;
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.add('active');
}
