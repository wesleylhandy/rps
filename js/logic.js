//set global variables
var turns = 0;

var userTurn;
var userTurnIndex = 0;
var computerTurnIndex = 0;
var turnValue = userTurnIndex + computerTurnIndex;

//object to track previous turn, used to for computer a.i.
var previousTurn = {
  indexes: 0,
  user: 0,
  winner: "none",
  consecutiveUserWins: 0
};

//initial game conditions
var drawGame = false;
var youWin = false;
var wins = 0;
var losses = 0;
var draws = 0;
var matchesWon = 0;
var matchesLost = 0;
var matchComplete = false;

//arrays for checking input and forming output
var validKeys = ["r", "p", "s"];
var keyValues = ['<i class="fa fa-hand-rock-o" aria-hidden="true"></i>', '<i class="fa fa-hand-paper-o" aria-hidden="true"></i>', '<i class="fa fa-hand-scissors-o" aria-hidden="true"></i>'];
var ids = ["#userInput", "#computerInput", "#winner", "#wins", "#losses", "#draws", "#matchesWon", "#matchesLost"];
var winAnimation = ['"animated bounceInDown"', '"animated fadeInUp"', '"animated rotateInDownRight"'];

//reset game to initial values
var reset = function() {
  wins = 0;
  losses = 0;
  draws = 0;
  turns = 0;
}

//check to see if user input is valid
var checkValid = function(key) {
  if (validKeys.includes(key)) {
    return true 
  } else {
  return false
  }
}

//calculate the move of the computer
var computerTurn = function() {
  /*          This code makes the computer behave more humanly
    based on mathematical research: https://youtu.be/rudzYPHuewc 

    The downside is that once the pattern is discerned, the user
    can beat the computer every time, so I added a randomizer
    after a set number of turns having lost                    */
  if (turns === 1 || previousTurn.winner === "draw" || previousTurn.consecutiveUserWins === 2) {
  computerTurnIndex = Math.floor(Math.random() * 3);

    //play what wasn't played last time
  } else if (previousTurn.winner === "user") {

    //paper beat rock : 1 + 0
    if (previousTurn.indexes === 1) {
    computerTurnIndex = 2;

    //rock beat scissors: 0 + 2
    } else if (previousTurn.indexes === 2) {
      computerTurnIndex = 1;
    } else {
      computerTurnIndex = 0;
    }
  } else {

    //play what user played last time
      computerTurnIndex = previousTurn.user;
  }
}

//determine if user or computer wins the game
var checkForGameWinner = function(val) {
  /*
    if userturn = computer then draw 
    if u = 0 and c = 1 computer win -1
    if u = 0 and c = 2 you win -2
    if u = 1 and c = 0 you win 1
    if u = 1 and c = 2 computer win -1
    if u = 2 and c = 0 computer win +2
    if u = 2 and c = 1 you win 1

    ----Look at patterns to reduce 7 conditionals to the following 3:
    if u - c = 0 draw
    if u - c = 1 or u - c = -2 you win
    else computer win
    */
  if (val === 0) {
    draws++;
    drawGame = true;
    previousTurn.winner = "draw";
    previousTurn.consecutiveUserWins = 0;
  } else if (val === 1 || val === -2) {
    wins++;
    youWin = true;
    previousTurn.winner = "user";
    previousTurn.user = userTurnIndex;
    previousTurn.consecutiveUserWins++;
  } else {
    losses++;
    youWin = false;
    previousTurn.winner = "computer";
    previousTurn.consecutiveUserWins = 0;
  }
}

//determine if computer or user wins the match (first to 3 wins)
var checkForMatchWinner = function() {
  if (wins === 3) {
    matchesWon++;
  } else if (losses === 3) {
    matchesLost++;
   }
  if (wins === 3 || losses === 3 ) {
    matchComplete = true;
    reset();
  }
}

//display values within html/css
var displayResult = function() {
  var val = [];

  //create an array of new information
    val[0] = keyValues[userTurnIndex];
    val[1] = keyValues[computerTurnIndex];
  if (drawGame) {
    val[2] = "<p>draw</p>";
    drawGame = false;
  } else if (youWin) {
    val[2] = '<p class=' + winAnimation[userTurnIndex] + '>You Won!</p>';
  } else {
    val[2] = '<p class=' + winAnimation[computerTurnIndex] + '>You Lost!</p>';
  }
  val[3] = "<p>Wins: " + wins + "</p>";
  val[4] = "<p>Losses: " + losses  + "</p>";
  val[5] = "<p>Draws: " + draws  + "</p>";
  val[6] = "<p>Matches Won: " + matchesWon  + "</p>";
  val[7] = "<p>Matches Lost: " + matchesLost + "</p>";

  //put new information into the html
  for (var c = 0; c < val.length; c++) {
    document.querySelector(ids[c]).innerHTML = val[c];
  }
}


// function to execute on key press
document.onkeyup = function () {
  userTurn = event.key;
  //console.log("userTurn.textContent: " + userTurn.textContent);

  if (checkValid(userTurn)) {
    turns++;
    computerTurn();
    userTurnIndex = validKeys.indexOf(userTurn);
    turnValue = userTurnIndex - computerTurnIndex;
    //console.log("turnValue :" + turnValue);
    checkForGameWinner(turnValue);
    checkForMatchWinner();
    displayResult();
    previousTurn.indexes = userTurnIndex + computerTurnIndex;
    /***needs work

    if (matchComplete) {
      var again = confirm("Do You Want to Play Again?");
    } 
    ****/
  } else {

    document.querySelector("#winner").innerHTML = "<p>Invalid Input</p>";

  }
}