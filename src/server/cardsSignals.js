const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class cardsSignals extends ObjectClass {
  constructor(parentID, x, y, dir, text) {
    super(shortid(), x, y, dir, 0);
    this.parentID = parentID;
    this.text = text;
    this.border = false;
    this.selected = false;
    this.wasOut = false;
    this.state = "draw-pile";
    this.parentIDPos = -1;
    this.posInHand = -1;
    this.posInPlay = -1;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    return true;
  }
  isInsideRect(cardX, cardY, width, height, px, py){
    return px >= cardX && px <= (width+cardX) && py >= cardY && py <= (height+cardY); 
  }
  wasOutRect(cardX, cardY, width, height, px, py){
    if(!(px >= cardX && px <= (width+cardX) && py >= cardY && py <= (height+cardY))) {
      this.wasOut = true;
    }
  }
  setParentID(parentID) {
      this.parentID = parentID;
  }
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      text: this.text,
      parentID: this.parentID,
      border: this.border,
      state: this.state,
      parentIDPos: this.parentIDPos,
      posInHand: this.posInHand,
      posInPlay: this.posInPlay,
      //hp: this.hp,
    };
  }
}



module.exports = cardsSignals;
