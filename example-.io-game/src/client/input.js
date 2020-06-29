// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
import { confrimButtonValue, mouseClick } from './index';
import { returnCanvasDimensions } from './render';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
 // const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  var canvasD = returnCanvasDimensions();
  
  const dir = [confrimButtonValue(), x, y, canvasD[0], canvasD[1], mouseClick()]; //canvasD[0], canvasD[1]
  updateDirection(dir); //remember the other stuff

  //updateDirection(confrimButtonValue(), x, y);
}

function mouseClicked() {
  
}


export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('MSPointerEnter', onMouseInput);
  window.addEventListener('MSGestureTap', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('MSPointerEnter', onMouseInput);
  window.removeEventListener('MSGestureTap', onTouchInput);
}
