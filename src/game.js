'use strict';

import * as algorithm from './algorithm';
import * as canvas from './canvas';

function loadState() {

    var state, i, j, y;
    
    state = JSON.parse('[{"39":[110]},{"40":[112]},{"41":[109,110,113,114,115]}]'); 
          
    for (i = 0; i < state.length; i++) {

        for (y in state[i]) {

            for (j = 0 ; j < state[i][y].length ; j++) {

              algorithm.addCell(state[i][y][j], parseInt(y, 10));

            }

        }
    
    }
}

function nextStep() {

      var i, x, y, r, liveCellNumber, algorithmTime, redrawList;

      // Algorithm run
    
      algorithmTime = (new Date());

      liveCellNumber = algorithm.nextGeneration();

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
          nextStep();
        }, 300);
}

export default function start(cb) {

    algorithm.init();
    
    loadState();

    canvas.init();
    canvas.clearWorld();
    canvas.drawWorld();
    nextStep();

    cb();

}
