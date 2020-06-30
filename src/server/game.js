const Constants = require('../shared/constants');
const Player = require('./player');
const cards= require('./cards')
const cardsSignals = require('./cardsSignals');
const RoundManger = require('./roundManger');
const CardManger = require('./cardManger');
const roundManger = new RoundManger();
const cardManger = new CardManger(); //possible issue here with init... beware...
const applyCollisions = require('./collisions');
var numOfPlayers = 0;
var init = true;
var i = 1
var mouseX = -1;
var mouseY = -1;
var count = 0;
var newRound = false;
var winnerOfRound = 0;
var hasPicked = false;
var posInPlay = 0;
class Game {

  constructor() {
    this.sockets = {};
    this.players = {};
    this.cards = [];
    this.cardsSignals = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    //const x = 0;
    //const y = 0;
    //Generate position
    const x = 60;
    const y = numOfPlayers*150 +100;
    //position = this.numOfPlayers;
    numOfPlayers = numOfPlayers + 1;
    console.log(numOfPlayers);
    this.players[socket.id] = new Player(socket.id, username, x, y, numOfPlayers, -1);
    var player = this.players[socket.id];
    console.log(JSON.stringify(this.players));
    cardManger.DrawCard(player, this.cards, 4, false);
    cardManger.DrawCard(player, this.cardsSignals, 3, true);
  }

  removePlayer(socket) {
    numOfPlayers -= 1;
    console.log(numOfPlayers);
    Object.keys(this.cards).forEach(cards => {
      const card = this.cards[cards];
      if(socket.id == card.parentID) {
        card.parentID = null;
        //console.log(JSON.stringify(card.parentID));
      }
    });
    Object.keys(this.cardsSignals).forEach(cards => {
      const card = this.cardsSignals[cards];
      if(socket.id == card.parentID) {
        card.parentID = null;
        //console.log(JSON.stringify(card.parentID));
      }
    });
    delete this.sockets[socket.id];
    delete this.players[socket.id];
    
  }

  handleInput(socket, dir) {
    //console.log(dir);
    if (this.players[socket.id]) {
      //this.players[socket.id].setDirection(dir); , buttonPress, x , y
      this.players[socket.id].putDown = dir[0];
      this.players[socket.id].pMouseX = dir[1];
     // console.log(dir[1]);
      this.players[socket.id].pMouseY = dir[2];
     // console.log(dir[2]);
     this.players[socket.id].pCanvasW = dir[3];
      //console.log(dir[3]);
      this.players[socket.id].pCanvasH = dir[4];
      //console.log(this.players[socket.id].pCanvasH);
      this.players[socket.id].cilentClick = dir[5];
      //console.log( this.players[socket.id].cilentClick);
    }
  }

  update() {
    //starts the program
    //console.log(JSON.stringify(this.players));
    if (init) {
      //roundManger = new RoundManger();
     /* console.log("hello5");
      for (var i = 1; i < 100; i++) {
        this.cards[i] = new cards(1, i+250, 50, 0, "Overload Test");
        console.log("hello5");
      }*/
      
      cardManger.init(this.cards, this.cardsSignals);
      init = false;
      init = false;
      //console.log(JSON.stringify(this.cards));
      //player
     
      
    }
    var totalPlayers = numOfPlayers;
   
    try {
      Object.keys(this.sockets).forEach(playerID => {
        const player = this.players[playerID];
        var isIn = player.isInsideRect(0, player.pCanvasH - player.pCanvasH*1/4 + 10, Constants.CARDS_WITH, Constants.CARDS_HEIGHT, player.pMouseX, player.pMouseY);
        if (player.cilentClick && isIn && !player.ready) {
          count++;
          player.ready = true;
        }
      });
    } catch {
      count = 0;
    }
    
    //console.log(totalPlayers +" " + count);
    if (!roundManger.hasInit && count == totalPlayers && totalPlayers != 0 && totalPlayers != 1 ) {
      roundManger.resetBool();   
      Object.keys(this.sockets).forEach(playerID => {
        console.log("hello")
        const player = this.players[playerID];
        console.log(player.pos);
           
        roundManger.initRound(player, totalPlayers);
      });
      roundManger.isRoundOver = false;
      count =0;
    }
    
    //i = i + 0.25;
    //this.cards[0].x = i
    // Calculate time elapsed
    if (newRound) {
      roundManger.isRoundOver = true;
      roundManger.currentPicker++;
      if(roundManger.currentPicker > numOfPlayers) {
        roundManger.currentPicker = 1;

      }
      console.log("current picker: " + roundManger.currentPicker);
      roundManger.resetBool(); 
      Object.keys(this.sockets).forEach(playerID => {
       // var totalPlayer = numOfPlayers;
        const player = this.players[playerID];
        if (!player.isPicking) {
          player.numOfCardsInHand -= 2;
          player.numOfFlagsInHand--;
          cardManger.DrawCard(player, this.cards, 2, false);
          cardManger.DrawCard(player, this.cardsSignals, 1, true);
        }
        player.reset();
        console.log(player.isTurnToPlay);
        console.log(numOfPlayers);
        
        //var totalPlayers = numOfPlayers;
        
        roundManger.initRound(player, numOfPlayers);
        console.log(player.isTurnToPlay);
        count++
      });
      if (count >= totalPlayers) {
        newRound = false;
        count = 0;
      }
      roundManger.isRoundOver = false;
    }
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    
    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      player.update(dt);
      roundManger.playRound(player,numOfPlayers);
     // console.log(roundManger.currentRound);
      if (player.isPicking && roundManger.currentRound == roundManger.subRounds.RoundWinnerPlay && !hasPicked) {
        //player.isInsideRect();
        //console.log("Its time")
        var canvasX = 0;
        var canvasY = 0;
        //console.log(player.isInsideRect(canvasX - Constants.PLAYER_RADIUS, canvasY-Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS*2, Constants.PLAYER_RADIUS*2, player.pMouseX, player.pMouseY ));
        //if (player.isInsideRect(canvasX - Constants.PLAYER_RADIUS, canvasY-Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS*2, Constants.PLAYER_RADIUS*2, player.pMouseX, player.pMouseY ) && clicked) {
          for (let pos = 0; pos <= numOfPlayers;  pos++) {
            //console.log(pos);
            var canvasX = 0;
            var canvasY = 0;
           // console.log(pos);
            if (pos < 4) {
              
              canvasX = player.pCanvasW / 8;
              canvasY = (pos)*150 +100
            }
            else {
              canvasX = player.pCanvasW/2;
              canvasY = (pos-4)*150 +100
            }
            var clicked = player.cilentClick; //is inside rect appears buged
           // console.log(canvasX);
           // console.log(player.isInsideRect(canvasX - Constants.PLAYER_RADIUS, canvasY-Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS*2, Constants.PLAYER_RADIUS*2, player.pMouseX, player.pMouseY ));
           // var clicked = player.cilentClick; //is inside rect appears buged
          if (player.isInsideRect(canvasX - Constants.PLAYER_RADIUS, canvasY-Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS*2, Constants.PLAYER_RADIUS*2, player.pMouseX, player.pMouseY ) 
          && clicked) {
            if (pos < 4) {
              winnerOfRound = pos+1;
            } else {
              winnerOfRound = pos;
            }
            console.log(winnerOfRound);
          }
           
            //console.log(player.WinnerOfRound);
        }
        
       
       
        
       /* */
        
        if (player.putDown && player.isPicking) {
          if (winnerOfRound != 0 && winnerOfRound != player.pos) {
            hasPicked = true;
            console.log(winnerOfRound);
          }
         
        }
    
      } else if (roundManger.currentRound == roundManger.subRounds.RoundWinnerPlay && player.pos == winnerOfRound && hasPicked) {
        player.score++;
        newRound = true;
        hasPicked = false;
        winnerOfRound = 0;
        roundManger.currentRound = roundManger.subRounds.NormalPlay;
      }
      //TODO: Figure out how to get player one to have the right poperty
      
     Object.keys(this.cards).forEach(cardSelected => {
        const card = this.cards[cardSelected]; //cards
        if(player.pos == card.parentID || card.parentID == playerID ) {
          card.parentIDPos = player.pos;
          card.parentID = playerID;
         
          if (card.state != "played" && card.state != "drawn") {
            card.state = "drawn";
          }
         // console.log(player.isTurnToPlay);
          if (player.isTurnToPlay &&  roundManger.currentRound == roundManger.subRounds.NormalPlay && !player.isPicking) {
          //console.log(JSON.stringify(card.parentID));
            var height = player.pCanvasH;
            var width = player.pCanvasW;
            var clicked = player.cilentClick; //is inside rect appears buged
            var isIn = card.isInsideRect((card.posInHand+1)*110, height*3/4 + 10 -20, Constants.CARDS_WITH, Constants.CARDS_HEIGHT, player.pMouseX, player.pMouseY);
            //console.log(clicked);
          // console.log("IT SHOULD BE WORKING: " + card.text + " " + clicked)
            if (isIn && clicked) {
            // console.log("IT SHOULD BE WORKING: " + card.text + " " + clicked)
              //console.log("mouse is inside card " + card.text);
              card.border = true;
              if (card.selected) {
                //card.selected = false
                //LOOK HERE
              } else {
                card.selected = true;
              }
              //console.log(card.border);
            } else if (!card.selected  || card.state == "played"){
              card.border = false;
            }
          if (card.selected && player.putDown && card.state == "drawn") {
            if (player.numOfCardsPlayed < 2) {
              card.posInPlay = posInPlay
              posInPlay++;
              player.numOfCardsPlayed++;
              console.log(player.numOfCardsPlayed);
              card.state = "played";
              card.x = (width/10) + Constants.CARDS_WITH*(player.numOfCardsPlayed-1) * 1.5;
              card.y = player.y - Constants.PLAYER_RADIUS*3;
              player.putDown = false;
              if (player.numOfCardsPlayed == 2) {
                posInPlay = 0;
              }
            }    
          }
        }
      }
      if (newRound) {
        if (card.state == "played") {
          card.x = -1000000;
          card.y = -1000000;
          card.state == "discard";
        }
       }

    });
      //RED FLAG CARDS
      Object.keys(this.cardsSignals).forEach(cards => {
        const card = this.cardsSignals[cards];
       
        if((player.pos == card.parentID || card.parentID == playerID) && card.state!="played") {
          card.parentIDPos = player.pos;
          card.parentID = playerID;
         
          if (card.state != "played" && card.state != "drawn") {
            card.state = "drawn";
          }
          //console.log(roundManger.currentRound);
          if (player.isTurnToPlay && roundManger.currentRound == roundManger.subRounds.FlagsPlay && !player.isPicking) {
              var height = player.pCanvasH;
              var width = player.pCanvasW;
              var clicked = player.cilentClick; //is inside rect appears buged
              var isIn = card.isInsideRect(width - (card.posInHand+1)*110, height*3/4 + 10 -20, Constants.CARDS_WITH, Constants.CARDS_HEIGHT, player.pMouseX, player.pMouseY);
              //console.log(clicked);
            // console.log("IT SHOULD BE WORKING: " + card.text + " " + clicked)
              if (isIn && clicked) {
              // console.log("IT SHOULD BE WORKING: " + card.text + " " + clicked)
                //console.log("mouse is inside card " + card.text);
                card.border = true;
                if (card.selected) {
                  //card.selected = false
                  //LOOK HERE
                } else {
                  card.selected = true;
                }
                //console.log(card.border);
              } else if (!card.selected  || card.state == "played"){
                card.border = false;
              }
            if (card.selected && player.putDown && card.state == "drawn") {
              if (player.numOfCardsPlayed < 1) {
                if (player.pos == numOfPlayers && roundManger.currentPicker != 1) {
                  card.parentIDPos = 1;
                } else if (player.pos == numOfPlayers && roundManger.currentPicker != 2) {
                  card.parentIDPos = 2; 
                } else if ((card.parentIDPos + 1)  != roundManger.currentPicker && (card.parentIDPos + 1) <= numOfPlayers) {
                  card.parentIDPos++;
                } else if ((card.parentIDPos + 2) <= numOfPlayers) {
                  card.parentIDPos += 2;
                }  else {
                  card.parentIDPos = 1;
                }
                
                //else if (player.pos == numOfPlayers && roundManger.currentPicker != 2) {
                  //card.parentIDPos = 2; 
                posInPlay = 2;
                card.posInPlay = posInPlay;
                player.numOfCardsPlayed++;
                card.state = "played";
                //card.x = (width/10) + Constants.CARDS_WITH*(player.numOfCardsPlayed*2) * 1.5;
                //card.y = player.y - Constants.PLAYER_RADIUS*3;
                player.putDown = false;
                if (player.numOfCardsPlayed == 1) {
                  posInPlay = 0;
                }
              }
            }
            //player.cilentClick = false;
          } 
        }
        if (newRound) {
          if (card.state == "played") {
            card.x = -1000000;
            card.y = -1000000;
            card.state == "discard";
          }
         }
          //console.log(JSON.stringify(card.parentID));
          //console.log(roundManger.currentRound);
         
      });
      var isIn = player.isInsideRect(0, player.pCanvasH - player.pCanvasH*1/4 + 10, Constants.CARDS_WITH, Constants.CARDS_HEIGHT, player.pMouseX, player.pMouseY);
      if (player.cilentClick && isIn && player.isTurnToPlay && !player.isPicking) {
          Object.keys(this.cards).forEach(cardSelected => {
            const card = this.cards[cardSelected];
              card.selected = false;
              card.border = false;
          });
          Object.keys(this.cardsSignals).forEach(cards => {
            const card = this.cardsSignals[cards];
              card.selected = false;
              card.border = false;
  
          });
        }
    });
    /*// Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));*/

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }
  //stuff here will limit rendering... beware...
  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE*2,
    );
    const nearbyCards = this.cards.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE*2,
    );
    const nearbyCardsSignals = this.cardsSignals.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE*2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      cards: nearbyCards.map(b => b.serializeForUpdate()),
      cardsSignals: nearbyCardsSignals.map(c => c.serializeForUpdate()),
      roundManger: roundManger.serializeForUpdate(), 
      leaderboard,
    };
  }
}

module.exports = Game;
