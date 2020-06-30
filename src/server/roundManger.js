const Player = require('./player');
const cards= require('./cards')
const cardsSignals = require('./cardsSignals');
//const game = require('./game');
var currentPlayer = 0;
var startingPlayer = 0;
var nextPlayer = false;
var currentRound = "FLAGS-PLAY"; //NORMAL-PLAY 
var initSubRound = false;
var currentPicker = 0;
var sitDOWNTwo = false;
class RoundManger {

    constructor() {
        this.subRounds = {
           NormalPlay: "NORMAL-PLAY",
           FlagsPlay: "FLAGS-PLAY",
           RoundWinnerPlay: "ROUND-END",
        }
        
        this.currentPicker = 1;
        this.isRoundOver = true;
        this.currentRound = currentRound;
        this.hasInit = false;
    } 
    resetBool() {
        sitDOWNTwo = false;
    }

    initRound( player, TotalPlayers) {
        if (this.isRoundOver) {
                    try {
                        var totalPlayers = TotalPlayers;
                    } catch {
                        var totalPlayers  = 0;
                    }
                    

                    /*if (player.pos == totalPlayers && player.isPicking) {
                        this.currentPicker = 1;
                        player.isPicking = false;
                        
                    } else {
                        this.currentPicker++;
                    }*/
                    console.log(this.currentPicker);
                    player.isPicking = false;
                    if (player.pos == this.currentPicker) {
                        player.isPicking = true;
                    }
                    currentRound = this.subRounds.NormalPlay; //TODO CHANGE THIS BACK

                    player.isTurnToPlay = false;
                    
                    console.log("hello?")
                    if (player.pos == 1 && !player.isPicking) {
                        player.isTurnToPlay = true;
                        currentPlayer = 1;
                        startingPlayer = 1;
                        console.log("round has begun");
                        sitDOWNTwo = true;

                    } 
                    else if (player.pos == 2 && !player.isPicking && !sitDOWNTwo) {
                        player.isTurnToPlay = true;
                        currentPlayer = 2;
                        startingPlayer =2;
                        console.log("round has begun");
                    }
                    this.hasInit = true;
                    currentPicker = this.currentPicker;
                }
       
    }  
    
    
    
    playRound(player, totalPlayers) {
        this.currentRound = currentRound;
        if (!this.isRoundOver) {
            //try {
                //console.log("current round " + totalPlayers)
            if (currentRound == this.subRounds.NormalPlay) {
                movePlayersSwitcher(player, totalPlayers, 2, this.subRounds.FlagsPlay);
            } else if (currentRound == this.subRounds.FlagsPlay) {
                movePlayersSwitcher(player, totalPlayers, 1, this.subRounds.RoundWinnerPlay);
            } else if (currentRound == this.subRounds.RoundWinnerPlay) {
                //console.log("something happens to round picker...")
            }
        /*} catch {
            var totalPlayers  = 0;
            console.log("ERROR 404 " + JSON.stringify(player));
        }*/
        }
    }
    serializeForUpdate() {
        return {
            currentRound: currentRound,
            hasInit: this.hasInit,
            //hp: this.hp,
          }; 
    }
}
function movePlayersSwitcher(player, totalPlayers, cardsForRound, nextRound) {
    if (!initSubRound) {
        if (player.isPicking ) {
            player.numOfCardsPlayed = 0;
            player.isTurnToPlay = false;
            nextPlayer = false;
            initSubRound = true;
        }
    }

    if (!player.isPicking) {
        if ((player.numOfCardsPlayed > (cardsForRound-1))) { //WATCH FOR BUGS
        
            player.numOfCardsPlayed = 0;
            player.isTurnToPlay = false;
            //console.log("currentPlayer " + currentPlayer);
            if (currentPicker != currentPlayer + 1) {
                console.log("hello");
                currentPlayer++;
            } else {
                currentPlayer +=2 ;
            }
            
            nextPlayer = true;
            player.alreadyPlayed = true;
            //console.log("current round " + totalPlayers);
           // console.log("current round " + currentPlayer);
        } else if (player.isTurnToPlay) {
            currentPlayer = player.pos;
        }
        
        if (currentPlayer <= totalPlayers && nextPlayer) {
            
            if (player.pos == currentPlayer && !player.alreadyPlayed) {
                player.isTurnToPlay = true;
                nextPlayer = false;
                
            } else if(player.isPicking&& player.pos == currentPlayer && currentPlayer != totalPlayers) {
                //currentPlayer++;
            } 
            
        } else if (startingPlayer == player.pos && currentPlayer > totalPlayers) {
                console.log(player.pos);
                player.isTurnToPlay = true;
                initSubRound = false;
                currentRound = nextRound;
                //console.log("current round " + currentRound);
                currentPlayer = player.pos;
                nextPlayer = false;
                player.alreadyPlayed = false;
        } else {
            player.alreadyPlayed = false;
        }

    //console.log((player.isPicking && player.isisTurnToPlay));
    } 
}
module.exports = RoundManger;