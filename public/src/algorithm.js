'use strict';

import _ from 'lodash';
import * as util from './util';

const ADD_NEW_CELL = 3;

export

function init(state) {

  if (_.isObject(state)) return convertToArray(state);

  if (_.isArray(state)) return state;

  // Default initial state
  return [
    [39, 110],
    [40, 112],
    [41, 109, 110, 113, 114, 115]
  ];

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

function nextGeneration(state) {

  let allDeadNeighbours = {};
  let newState = [];
  let redrawList = [];

  _.forEach(state, (lines, i) => {

    const row = _.first(lines);

    let topPointer = 1;
    let bottomPointer = 1;

    _.forEach(lines, (col) => {

      // Possible dead neighbours
      const deadNeighbours = [
        [col - 1, row - 1, 1],
        [col, row - 1, 1],
        [col + 1, row - 1, 1],
        [col - 1, row, 1],
        [col + 1, row, 1],
        [col - 1, row + 1, 1],
        [col, row + 1, 1],
        [col + 1, row + 1, 1]
      ];

      // Get number of live neighbours and remove alive neighbours from deadNeighbours
      const neighbours = getNeighboursFromAlive(col, row, i, deadNeighbours, state, topPointer, bottomPointer);

      // Join dead neighbours to check list
      _.forEach(_.range(8), (m) => {

        if (deadNeighbours[m] !== undefined) {

          const key = deadNeighbours[m][0] + ',' + deadNeighbours[m][1]; // Create hashtable key

          allDeadNeighbours[key] === undefined ? allDeadNeighbours[key] = 1 : allDeadNeighbours[key]++;

        }

      });

      if (!(neighbours === 0 || neighbours === 1 || neighbours > 3)) {

        newState = switchToAlive(col, row, newState);
        redrawList.push([col, row, 2]); // Keep alive

      } else {

        redrawList.push([col, row, 0]); // Kill cell
      }

    });

  });

  // Process dead neighbours
  for (let [position, action] of util.dictEntriesGen(allDeadNeighbours)) {

    if (action === ADD_NEW_CELL) { // Add new Cell

      position = position.split(',');

      const x = parseInt(_.first(position), 10);
      const y = parseInt(_.last(position), 10);

      newState = switchToAlive(x, y, newState);
      redrawList.push([x, y, 1]);

    }

  }

  //return alive;
  return {
    'state': newState,
    'changes': redrawList
  };

}

export

function getNeighboursFromAlive(x, y, i, possibleNeighboursList, state, topPointer, bottomPointer) {

  let neighbours = 0;

  const update = (s, k, type) => {

    if (type == 'middle') {

      if (s >= (x - 1)) {

        if (s === (x - 1)) {

          possibleNeighboursList[3] = undefined;
          neighbours++;

        }

        if (s === (x + 1)) {

          possibleNeighboursList[4] = undefined;
          neighbours++;

        }

        if (s > (x + 1)) return;

      }

      return;

    }

    if (s >= (x - 1)) {

      if (s === (x - 1)) {

        possibleNeighboursList[type == 'top' ? 0 : 5] = undefined;
        type == 'top' ? topPointer += (k + 1) : bottomPointer += (k + 1);
        neighbours++;

      }

      if (s === x) {

        possibleNeighboursList[type == 'top' ? 1 : 6] = undefined;
        type == 'top' ? topPointer += k : bottomPointer += k;
        neighbours++;

      }

      if (s === (x + 1)) {

        possibleNeighboursList[type == 'top' ? 2 : 7] = undefined;

        if (k == 1) {

          type == 'top' ? topPointer = 1 : bottomPointer = 1;

        } else {

          type == 'top' ? topPointer += (k - 1) : bottomPointer += (k - 1);

        }

        neighbours++;

      }

      if (s > (x + 1)) return;

    }

  };

  // Top
  if (state[i - 1] !== undefined) {

    if (state[i - 1][0] === (y - 1)) {

      _.forEach(_.drop(state[i - 1], topPointer), (s, k) => update(s, k, 'top'));

    }
  }

  // Middle
  _.forEach(_.rest(state[i]), (s, k) => update(s, k, 'middle'));

  // Bottom
  if (state[i + 1] !== undefined) {

    if (state[i + 1][0] === (y + 1)) {

      _.forEach(_.drop(state[i + 1], bottomPointer), (s, k) => update(s, k, 'bottom'));

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