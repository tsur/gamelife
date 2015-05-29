'use strict';

import * as algorithm from './algorithm';
import canvas from './canvas';
import _ from 'lodash';
import {
  session
}
from './util';

function run(state) {

  // Algorithm run
  const next = algorithm.nextGeneration(state);

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
  session.timer = setTimeout(() => run(next.state), 300);

}

function init() {

  const state = algorithm.init();

  canvas.init().drawWorld(state);

  return state;

};

export
default (state) => run(state ? state : init());