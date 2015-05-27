'use strict';

function clickEventListener(selector, handler) {

  document.querySelector(selector).addEventListener('click', (e) => handler(e));

}

function reload(event) {

  console.log('click reload');

}

function start(event) {

  console.log('click start');

}

function draw(event) {

  console.log('click draw');

}

export
default

function() {

  clickEventListener('.actions-reload', reload);
  clickEventListener('.actions-start', start);
  clickEventListener('.actions-draw', draw);

};