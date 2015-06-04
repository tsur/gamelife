import runGame from './game';
import runActions from './actions';

// Kick it off after window object has loaded (all resources were loaded)
window.onload = () => runActions(runGame());
//@TODO: Remove for produccion
window.onload();