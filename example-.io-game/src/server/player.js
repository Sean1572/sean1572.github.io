const ObjectClass = require('./object');
const card = require('./cards');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y, pos, numOfCardsInHand) {
    super(id, x, y, 0, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.pos = pos;
    this.numOfCardsInHand = numOfCardsInHand;
    this.numOfFlagsInHand = -1;
    this.numOfCardsPlayed = 0;
    this.text = "hello";
    this.pMouseX = -1;
    this.pMouseY = -1;
    this.pCanvasW = 0;
    this.pCanvasH = 0;
    this.cilentClick = false;
    this.fristTime = true;
    this.putDown = false;
    this.isPicking = false;
    this.isTurnToPlay = false;
    this.ready = false;
    this.alreadyPlayed = false;
    this.WinnerOfRound = 0;
    //this.text = text;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
   // this.score = this.pos;

    // Make sure the player stays in bounds
    this.x = this.x;
    this.y = this.y;
   // document.write(5+6);

  }
  addCard() {
    this.numOfCardsInHand++; 
  }
  removeCard() {
    this.numOfCardsInHand--;
  }
  isInsideRect(cardX, cardY, width, height, px, py){
    return px >= cardX && px <= (width+cardX) && py >= cardY && py <= (height+cardY); 
  }
  reset() {
    //this.score = 0;

    this.numOfCardsPlayed = 0;
   // this.text = "hello";
    this.putDown = false;
    this.isPicking = false;
   // this.isTurnToPlay = false;
    //this.ready = false;
    this.alreadyPlayed = false;
    this.WinnerOfRound = 0;
  }
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      pos: this.pos,
      text: this.text,
      cilentClick: this.cilentClick,
      isTurnToPlay: this.isTurnToPlay,
    };
  }
}

module.exports = Player;
