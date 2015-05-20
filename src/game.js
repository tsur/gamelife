'use strict';

import * as algorithm from './algorithm';
import * as canvas from './canvas';

function loadState() {

  return algorithm.convertToArray({
    "39": [110],
    "40": [112],
    "41": [109, 110, 113, 114, 115]
  });

}

function nextStep(state) {

  var i, x, y, r, algorithmTime, redrawList;

  // Algorithm run

  algorithmTime = (new Date());

  var newState = algorithm.nextGeneration(state);

  algorithmTime = (new Date()) - algorithmTime;

  redrawList = algorithm.getRedrawList();


  // Canvas run

  for (i = 0; i < redrawList.length; i++) {

    x = redrawList[i][0];
    y = redrawList[i][1];

    if (redrawList[i][2] === 1) {

      canvas.changeCelltoAlive(x, y);

    } else if (redrawList[i][2] === 2) {

      canvas.keepCellAlive(x, y);

    } else {

      canvas.changeCelltoDead(x, y);

    }

  }
  // Flow Control
  setTimeout(function() {
    nextStep(newState);
  }, 300);
}

export
default

function start(cb) {

  var state = loadState();

  canvas.init();
  canvas.clearWorld();
  canvas.drawWorld(state);
  nextStep(state);

  cb();

}