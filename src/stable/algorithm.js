'use strict';

import _ from 'lodash';

var actualState = [];
var redrawList = [];
var topPointer = 1;
var bottomPointer = 1;
var middlePointer = 1;

export

function init(state) {

  return new Array();

}

export

function convertToPOJO(state) {

  if (!_.isArray(state) || _.isEmpty(state)) {

    return new Object();

  }

  state = _.filter(state, (e) => _.isArray(e) && !_.isEmpty(e));

  return _.zipObject(_.map(state, (e) => _.first(e)), _.map(state, (e) => _.uniq(_.sortBy(_.drop(e)))));

}

export

function getRedrawList() {

  return redrawList;

};

export

function nextGeneration() {

  let x, y, i, j, m, n, key, t1, t2, alive = 0,
    neighbours, deadNeighbours, allDeadNeighbours = {},
    newState = [];

  redrawList = [];

  for (i = 0; i < actualState.length; i++) {

    topPointer = 1;
    bottomPointer = 1;

    console.log(actualState, actualState[i].length);

    for (j = 1; j < actualState[i].length; j++) {

      x = actualState[i][j];
      y = actualState[i][0];

      // Possible dead neighbours
      deadNeighbours = [
        [x - 1, y - 1, 1],
        [x, y - 1, 1],
        [x + 1, y - 1, 1],
        [x - 1, y, 1],
        [x + 1, y, 1],
        [x - 1, y + 1, 1],
        [x, y + 1, 1],
        [x + 1, y + 1, 1]
      ];

      // Get number of live neighbours and remove alive neighbours from deadNeighbours
      neighbours = getNeighboursFromAlive(x, y, i, deadNeighbours);

      // Join dead neighbours to check list
      for (m = 0; m < 8; m++) {

        if (deadNeighbours[m] !== undefined) {

          key = deadNeighbours[m][0] + ',' + deadNeighbours[m][1]; // Create hashtable key

          if (allDeadNeighbours[key] === undefined) {
            allDeadNeighbours[key] = 1;
          } else {
            allDeadNeighbours[key]++;
          }

        }

      }

      if (!(neighbours === 0 || neighbours === 1 || neighbours > 3)) {

        addCell(x, y, newState);
        alive++;
        redrawList.push([x, y, 2]); // Keep alive

      } else {

        redrawList.push([x, y, 0]); // Kill cell
      }

    }
  }

  // Process dead neighbours
  for (key in allDeadNeighbours) {

    if (allDeadNeighbours[key] === 3) { // Add new Cell

      key = key.split(',');
      t1 = parseInt(key[0], 10);
      t2 = parseInt(key[1], 10);

      addCell(t1, t2, newState);
      alive++;
      redrawList.push([t1, t2, 1]);

    }

  }

  actualState = newState;

  return alive;
}

export

function getNeighboursFromAlive(x, y, i, possibleNeighboursList) {

  var neighbours = 0,
    k;

  // Top
  if (actualState[i - 1] !== undefined) {

    if (actualState[i - 1][0] === (y - 1)) {

      for (k = topPointer; k < actualState[i - 1].length; k++) {

        if (actualState[i - 1][k] >= (x - 1)) {

          if (actualState[i - 1][k] === (x - 1)) {
            possibleNeighboursList[0] = undefined;
            topPointer = k + 1;
            neighbours++;
          }

          if (actualState[i - 1][k] === x) {
            possibleNeighboursList[1] = undefined;
            topPointer = k;
            neighbours++;
          }

          if (actualState[i - 1][k] === (x + 1)) {
            possibleNeighboursList[2] = undefined;

            if (k == 1) {
              topPointer = 1;
            } else {
              topPointer = k - 1;
            }

            neighbours++;
          }

          if (actualState[i - 1][k] > (x + 1)) {
            break;
          }
        }

      }
    }
  }

  // Middle
  for (k = 1; k < actualState[i].length; k++) {

    if (actualState[i][k] >= (x - 1)) {

      if (actualState[i][k] === (x - 1)) {
        possibleNeighboursList[3] = undefined;
        neighbours++;
      }

      if (actualState[i][k] === (x + 1)) {
        possibleNeighboursList[4] = undefined;
        neighbours++;
      }

      if (actualState[i][k] > (x + 1)) {
        break;
      }
    }

  }

  // Bottom
  if (actualState[i + 1] !== undefined) {

    if (actualState[i + 1][0] === (y + 1)) {

      for (k = bottomPointer; k < actualState[i + 1].length; k++) {

        if (actualState[i + 1][k] >= (x - 1)) {

          if (actualState[i + 1][k] === (x - 1)) {
            possibleNeighboursList[5] = undefined;
            bottomPointer = k + 1;
            neighbours++;
          }

          if (actualState[i + 1][k] === x) {
            possibleNeighboursList[6] = undefined;
            bottomPointer = k;
            neighbours++;
          }

          if (actualState[i + 1][k] === (x + 1)) {
            possibleNeighboursList[7] = undefined;

            if (k == 1) {
              bottomPointer = 1;
            } else {
              bottomPointer = k - 1;
            }

            neighbours++;
          }

          if (actualState[i + 1][k] > (x + 1)) {
            break;
          }

        }

      }

    }

  }

  return neighbours;

}

export

function isAlive(x, y) {

  var i, j;

  for (i = 0; i < actualState.length; i++) {

    if (actualState[i][0] === y) {

      for (j = 1; j < actualState[i].length; j++) {

        if (actualState[i][j] === x) {
          return true;
        }

      }

    }

  }

  return false;
}

export

function removeCell(x, y, state) {

  var i, j;

  state = state || actualState;

  for (i = 0; i < state.length; i++) {

    if (state[i][0] === y) {

      if (state[i].length === 2) { // Remove all Row

        state.splice(i, 1);

      } else { // Remove Element

        for (j = 1; j < state[i].length; j++) {

          if (state[i][j] === x) {
            state[i].splice(j, 1);
          }

        }

      }

    }

  }
}

export

function addCell(x, y, state) {

  // if (_.isArray(state)) return actualState = state;

  // state = state || actualState;

  // // console.log(x, y, state, actualState);

  // let statePOJO = convertToPOJO(actualState);

  // _.isArray(statePOJO[y]) ? statePOJO[y].push(x) : statePOJO[y] = [x];

  // actualState = convertToArray(statePOJO);

  state = state || actualState;

  console.log(x, y, state, actualState);

  if (state.length === 0) {

    state.push([y, x]);
    return;

  }

  let k, n, m, tempRow, newState = [],
    added;

  if (y < state[0][0]) { // Add to Head

    newState = [
      [y, x]
    ];

    for (k = 0; k < state.length; k++) {
      newState[k + 1] = state[k];
    }

    for (k = 0; k < newState.length; k++) {
      state[k] = newState[k];
    }

    return;

  } else if (y > state[state.length - 1][0]) { // Add to Tail

    state[state.length] = [y, x];
    return;

  } else { // Add to Middle

    for (n = 0; n < state.length; n++) {

      if (state[n][0] === y) { // Level Exists

        tempRow = [];
        added = false;

        for (m = 1; m < state[n].length; m++) {

          if ((!added) && (x < state[n][m])) {
            tempRow.push(x);
            added = !added;
          }

          tempRow.push(state[n][m]);
        }

        console.log(tempRow.toString());

        tempRow.unshift(y);

        console.log(tempRow.toString());

        if (!added) {

          tempRow.push(x);

        }

        console.log(tempRow.toString());

        state[n] = tempRow;

        console.log(tempRow.toString(), state.toString());
        return;

      }

      if (y < state[n][0]) { // Create Level

        newState = [];

        for (k = 0; k < state.length; k++) {

          if (k === n) {
            newState[k] = [y, x];
            newState[k + 1] = state[k];
          } else if (k < n) {
            newState[k] = state[k];
          } else if (k > n) {
            newState[k + 1] = state[k];
          }

        }

        for (k = 0; k < newState.length; k++) {
          state[k] = newState[k];
        }

        return;

      }

    }

  }
}


export

function convertToPOJO(state) {

  if (!_.isArray(state) || _.isEmpty(state)) {

    return new Object();

  }

  state = _.filter(state, (e) => _.isArray(e) && !_.isEmpty(e));

  return _.zipObject(_.map(state, (e) => _.first(e)), _.map(state, (e) => _.uniq(_.sortBy(_.drop(e)))));

}

export

function convertToArray(state) {

  if (!_.isObject(state) || _.isEmpty(state)) {

    return new Array();

  }

  return _.filter(_.map(state, (v, k) => {

    let values = _.uniq(_.sortBy(v));

    values.unshift(+k);

    return values;

  }), (e) => _.isArray(e) && e.length > 1);

}