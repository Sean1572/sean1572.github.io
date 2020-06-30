// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
var i = 0;
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;
var canvasWidth = 0;
var canvasHeight = 0;
// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  //canvas.width = scaleRatio * window.innerWidth;
  //canvas.height = scaleRatio * window.innerHeight;
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
  
  //window.moveTo(0, 0);
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  //context.clearRect(0, 0, canvas.width, canvas.height);
  const { me, roundManger, others, cards, cardsSignals } = getCurrentState();
  if (!me) {
    return;
  }
  var backX = canvas.width/2;
  var backY = canvas.height/2;
  //context.font = "20px Arial";
  //context.fillText("")
  // Draw background  me.x, me.y
  renderBackground(backX, backY);
  renderRoundLabel(0, 0, roundManger) 
  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(0, 0, canvas.width, canvas.height*3/4); //ontext.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);
  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
  others.forEach(renderPlayer.bind(null, me));
  // Draw all bullets
  cards.forEach(renderCard.bind(others, me));
  cardsSignals.forEach(renderCardSignal.bind(null, me));

 // renderCard(me, cards);
 
  
 
}

function renderBackground(x, y) {
  const backgroundX = x; //MAP_SIZE / 2 - x + canvas.width / 2
  const backgroundY = y; //MAP_SIZE / 2 - y + canvas.height*3/4 / 2
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderRoundLabel(x, y, roundManger) {
  context.fillStyle = 'red';
  context.fillRect(x, y, 200, 30,);
  context.fillStyle = 'white';
  context.font = "20px Arial";
  if (roundManger.hasInit) {
    context.fillText(roundManger.currentRound.replace('NaN', ''), 80, 20, 2000);
  } else {
    context.fillText("Confrim On Green", 80, 20, 2000);
  }
   //JSON.stringify(roundManger.currentRound)
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, pos, cilentClick, isTurnToPlay } = player;
  var canvasX = x; //canvas.width / 8 + 
  var canvasY = y; //canvas.height / 8 + 

  

  if (pos < 4) {
    canvasX = canvas.width / 8;
    canvasY = (pos - 1)*150 +100
  }
  else {
    canvasX = canvas.width /2;
    canvasY = (pos - 4)*150 +100
  }
    if (player.y == me.y) {
    context.fillStyle = 'white';
    context.fillRect(canvasX+50, canvasY, 20, 20,);

  }
  i++;
  context.font = "20px Arial";
  //context.fillText(isTurnToPlay, canvasX-50, canvasY, 20000);
  // Draw ship
  if (isTurnToPlay) {
    context.fillStyle = 'white';
  } else {
    context.fillStyle = 'red'
  }
  context.save();
  context.translate(canvasX, canvasY);
  context.fillRect(
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();
  context.fillStyle = 'green'
  context.fillRect(0, canvas.height - canvas.height*1/4 + 10,100, 150);
}

function renderCard(me, card) {
 // var text = JSON.stringify(card);


  const { x, y, direction, parentID, text, border, state, parentIDPos, posInHand, posInPlay} = card;
  //text = text.replace("NaN", "");
  
  context.font = "20px Arial";
  const words =  text.split(' ');
  //words = words.replace("NaN", "");
  const incrementFactor = 4; // it adds 4 pixels to rect for each line
  const paragraphCount = words.length // Define the paragraph count
  var maxWidth = 220;
  var lineHeight = 25;
  var canvasX =  x;
  var canvasY =  y;

  //put the card in a person's hand/in play
  if(state == "playedNaN" || state == "played") {
    //canvasX = x;
    //canvasY = y;
    if (parentIDPos < 4) {
      //canvasX = canvasX + canvas.width /2
      canvasX = canvas.width / 8 + 110*posInPlay; //x was here
      canvasY = (parentIDPos - 1)*150 +100 - Constants.PLAYER_RADIUS*3
    }
    else {
      canvasX = canvas.width /2 + 110*posInPlay; //x was here
      canvasY = (parentIDPos - 4)*150 +100 - Constants.PLAYER_RADIUS*3
    }
  }
  else if (parentID == me.id) {
    canvasY = canvas.height - canvas.height*1/4 + 10;
    canvasX = (posInHand+1)*110;
  }
  else {
    //canvasX = 1000000000000000;
    //canvasY = 1000000000000000;
  }
  //context.fillText(parentID, canvasX, canvasY, 2000);
 //parentID

  // Draw ship
  context.save();
  //context.translate(canvasX, canvasY);
 
  //context.font = "60px Arial";
  if (border && state != "playedNaN") {
    context.fillStyle = 'blue';
    drawBorder(canvasX, canvasY, 100, 150, 5)

  } else {
    //drawBorder(10000000, 100000000, 100, 150)
    drawBorder(canvasX, canvasY, 100, 150, 0)
  }
  
  context.rotate(direction);
  context.textAlign = "center";
  context.fillStyle = 'white';
  context.fillRect(canvasX,canvasY,100, 150);
  context.fillStyle = 'red';
  var textTest = "not touche"




  drawWords(context, text, canvasX+55, canvasY+20, 90, 25, 150, words)
  
}
function renderCardSignal(me, card) {
  // var text = JSON.stringify(card);
 
  const { x, y, direction, parentID, text, border, state, parentIDPos, posInHand, posInPlay} = card;
  context.font = "20px Arial";
  const words =  text.split(' ');
  //words = words.replace("NaN", "");
  const incrementFactor = 4; // it adds 4 pixels to rect for each line
  const paragraphCount = words.length // Define the paragraph count
  var maxWidth = 220;
  var lineHeight = 25;
  var canvasX = x;
  var canvasY = y;

  //put the card in a person's hand/in play
 //put the card in a person's hand/in play
 if(state == "playedNaN" || state == "played") {
  //canvasX = x;
  //canvasY = y;
  if (parentIDPos < 4) {
    //canvasX = canvasX + canvas.width /2
    canvasX = canvas.width /8+ 110*posInPlay;
    canvasY = (parentIDPos - 1)*150 +100 - Constants.PLAYER_RADIUS*3
  }
  else {
    canvasX = canvas.width /2 +110*posInPlay;
    canvasY = (parentIDPos - 4)*150 +100 - Constants.PLAYER_RADIUS*3
  }
}
else if (parentID == me.id) {
  canvasY = canvas.height - canvas.height*1/4 + 10;
  canvasX = canvas.width - (posInHand+1)*110;
}
else {
  //canvasX = 1000000000000000;
  //canvasY = 1000000000000000;
}
//context.fillText(parentIDPos, canvasX, canvasY, 2000);
 //parentID

  // Draw ship
  context.save();
  //context.translate(canvasX, canvasY);
 
  //context.font = "60px Arial";
  if (border) {
    context.fillStyle = 'blue';
    drawBorder(canvasX, canvasY, 100, 150, 5)

  } else {
    //drawBorder(10000000, 100000000, 100, 150)
    drawBorder(canvasX, canvasY, 100, 150, 0)
  }
  //context.fillText(JSON.stringify(parentID), canvasX, canvasY, 2000);



   //context.translate(canvasX, canvasY);
  
   //context.font = "60px Arial";
   context.save();
   context.rotate(direction);
   context.textAlign = "center";
  //context.fillText(text.replace("NaN", ""), canvasX, canvasY, 2000);
  context.fillStyle = 'red';
  context.fillRect(canvasX,canvasY,100, 150);
  context.fillStyle = 'white';
  drawWords(context, text, canvasX+55, canvasY+20, 90, 25, 150, words)




context.restore();
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

function drawWords(context, text, x, y, maxWidth, lineHeight, rectHeight, words) {
  var line = '';
  for(var n = 0; n < words.length; n++) {
       var testLine = line + words[n] + ' ';
       var metrics = context.measureText(testLine);
       var testWidth = metrics.width;
       if (testWidth > maxWidth && n > 0) {
         context.fillText(line, x, y);
         line = words[n] + ' ';
         y += lineHeight;
       }
       else {
         line = testLine;
       }
     }
     context.fillText(line.replace('NaN', ''), x, y);
      rectHeight=rectHeight + lineHeight; 
} 

function drawBorder(xPos, yPos, width, height, thickness = 1)
{
  context.fillStyle='#000';
  context.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

export function returnCanvasDimensions() {
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  var canvasDimension = [canvasWidth, canvasHeight];
  return canvasDimension;
}

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
