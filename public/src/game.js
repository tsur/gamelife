'use strict';

import mutableState from './state'
import * as algorithm from './algorithm';
import canvas from './canvas';
import _ from 'lodash';
import {
  session
}
from './util';

function nextCicle(state) {

  mutableState.set('cicle', function(){
    return mutableState.get('cicle', 0) + 1;
  }());

  return algorithm.nextGeneration(state);

}

function run(state) {

  let next,i;

  next = {
    state:state
  };

  i = 0;

  // Algorithm run
  while(i < mutableState.get('plusInterval', 1)){
    next = nextCicle(next.state);
    i++;
  }

  console.log(mutableState.get('cicle', 0));

  // Canvas run
  _.forEach(next.changes, (e) => {

    const x = e[0];
    const y = e[1];

    if (e[2] === 1) return canvas.changeCelltoAlive(x, y);

    if (e[2] === 2) return canvas.keepCellAlive(x, y);

    canvas.changeCelltoDead(x, y);

  });

  // Flow Control
  session.next = next.state;
  session.timer = setTimeout(() => run(next.state), mutableState.get('timeInterval'));

}

function init() {

  const state = algorithm.init();

  canvas.init().drawWorld(state);

  return state;

};

export
default (state) => run(state ? state : init());