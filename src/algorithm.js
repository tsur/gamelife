'use strict';

import _ from 'lodash';

var redrawList = [];
var topPointer = 1;
var bottomPointer = 1;
var middlePointer = 1;

export

function init() {

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

export

function getRedrawList() {

  return redrawList;

};

export

function nextGeneration(actualState) {

  let x, y, i, j, m, n, key, t1, t2, alive = 0,
    neighbours, deadNeighbours, allDeadNeighbours = {},
    newState = [];

  redrawList = [];

  for (i = 0; i < actualState.length; i++) {

    topPointer = 1;
    bottomPointer = 1;

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
      neighbours = getNeighboursFromAlive(x, y, i, deadNeighbours, actualState);

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

        newState = switchToAlive(x, y, newState);
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

      newState = switchToAlive(t1, t2, newState);
      alive++;
      redrawList.push([t1, t2, 1]);

    }

  }


  //return alive;
  return newState;

}

export

function getNeighboursFromAlive(x, y, i, possibleNeighboursList, actualState) {

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

function isAlive(x, y, state) {

  let statePOJO = convertToPOJO(state);

  return _.isArray(statePOJO[y]) && _.find(statePOJO[y], x);

}

export

function isDead(x, y, state) {

  return !isAlive(x, y, state);

}

export

function switchToDead(x, y, state) {

  let statePOJO = convertToPOJO(state);

  if (!_.isArray(statePOJO[y]) || _.isEmpty(statePOJO[y])) return convertToArray(statePOJO);

  statePOJO[y].length === 1 ? statePOJO[y] = null : statePOJO[y].splice(_.find(statePOJO[y], x), 1);

  return convertToArray(statePOJO);

}

export

function switchToAlive(x, y, state) {

  let statePOJO = convertToPOJO(state);

  _.isArray(statePOJO[y]) ? statePOJO[y].push(x) : statePOJO[y] = [x];

  return convertToArray(statePOJO);

}