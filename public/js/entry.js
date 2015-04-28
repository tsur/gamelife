import * as game from './game.js';

// Kick it off after window object has loaded (all resources were loaded)
window.addEventListener('load', () => {

  game.start(function(){
  
      console.log('running game animation');

  });

}, false);
