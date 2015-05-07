'use strict';

import _ from 'lodash';
import * as algorithm from './algorithm';

var context = null;
var width = null;
var height = null;
var age = null;
var cellSize = null;
var cellSpace = null;
var canvas = null;
var rows = null;
var columns = null;

var colors = {

    dead : '#FFFFFF',
    trail : ['#B5ECA2'],
    alive : ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF', '#1313FF', '#2626FF', '#3939FF', '#4C4CFF', '#5F5FFF', '#7272FF', '#8585FF']
      
};

export function init() {

    canvas = document.getElementById('gameOfLife');
    context = canvas.getContext('2d');

    cellSize = 4;
    cellSpace = 1;
    rows = 86;
    columns = 180;

    clearWorld();
};


export function clearWorld() {

    var i, j;

    // Init ages (Canvas reference)
    age = [];

    for (i = 0; i < columns; i++) {

      age[i] = [];

      for (j = 0; j < rows; j++) {
        age[i][j] = 0; // Dead
      }
    }

};

export function drawWorld() {
    
    var i, j;
    
    width = height = 1;

    // Dynamic canvas size
    width = width + (cellSpace * columns) + (cellSize * columns);
    canvas.setAttribute('width',width);

    height = height + (cellSpace * rows) + (cellSize * rows);
    canvas.getAttribute('height', height);

    // Fill background
    context.fillStyle = '#F3F3F3';
    context.fillRect(0, 0, width, height);

    for (i = 0 ; i < columns; i++) {

      for (j = 0 ; j < rows; j++) {

        if (algorithm.isAlive(i, j)) {

          drawCell(i, j, true);

        } else {

          drawCell(i, j, false);

        }

      }

    }
};

export function drawCell(i, j, alive) {
                
    if (alive) {

      if (age[i][j] > -1) context.fillStyle = colors.alive[age[i][j] % colors.alive.length];

    } else {
      
      if (age[i][j] < 0) {

        context.fillStyle = colors.trail[(age[i][j] * -1) % colors.trail.length];

      } else {

        context.fillStyle = colors.dead;

      }

    }

    context.fillRect(cellSpace + (cellSpace * i) + (cellSize * i), cellSpace + (cellSpace * j) + (cellSize * j), cellSize, cellSize);
            
};

export function switchCell(i, j) {

    if(algorithm.isAlive(i, j)) {

      changeCelltoDead(i, j);
      algorithm.removeCell(i, j);

    } else {
      
      changeCelltoAlive(i, j);
      algorithm.addCell(i, j);

    }

};

export function keepCellAlive(i, j) {

        if (i >= 0 && i < columns && j >=0 && j < rows) {
          age[i][j]++;
          drawCell(i, j, true);
        }

};

export function changeCelltoAlive(i, j) {

        if (i >= 0 && i < columns && j >=0 && j < rows) {
          age[i][j] = 1;
          drawCell(i, j, true);
        }

};

export function changeCelltoDead(i, j) {

        if (i >= 0 && i < columns && j >=0 && j < rows) {
          age[i][j] = -age[i][j]; // Keep trail
          drawCell(i, j, false);
        }
};