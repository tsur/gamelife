'use strict';

import _ from 'lodash';
import runGame from './game';
import canvas from './canvas';
import {
  switchToAlive
}
from './algorithm';
import {
  session
}
from './util';

const playIcon = document.querySelector('.actions-start span.play');
const pauseIcon = document.querySelector('.actions-start span.pause');

function clickEventListener(selector, handler) {

  document.querySelector(selector).addEventListener('click', (e) => handler(e));

}

const drawEventListener = (e) => session.drawing = canvas.init().freeDraw(e, session.drawing);

function draw(event) {

  clearInterval(session.timer);

  canvas.clearWorld().drawWorld();

  session.drawing = [];

  canvas.getElement().addEventListener('click', drawEventListener, false);

  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');

}

function start(event) {

  //Pause it
  if (_.contains(playIcon.classList, 'hidden')) {

    clearInterval(session.timer);

    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');

  } else {

    canvas.getElement().removeEventListener('click', drawEventListener, false);

    runGame(session.drawing ? session.drawing : session.next);

    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');

  }

}

function pause(event) {

  clearInterval(session.timer);

}

function reload(event) {

  clearInterval(session.timer);

  session.drawing = null;
  canvas.getElement().removeEventListener('click', drawEventListener, false);

  runGame();

  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');

}

export
default

function() {

  clickEventListener('.actions-reload', reload);
  clickEventListener('.actions-start', start);
  clickEventListener('.actions-draw', draw);

};