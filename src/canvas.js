'use strict';

import _ from 'lodash';
import * as algorithm from './algorithm';

function Canvas() {};

Canvas.colors = {

  dead: '#FFFFFF',
  trail: ['#B5ECA2'],
  alive: ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF', '#1313FF', '#2626FF', '#3939FF', '#4C4CFF', '#5F5FFF', '#7272FF', '#8585FF']

};

Canvas.prototype.init = function init() {

  this.canvas = document.getElementById('gameOfLife');
  this.context = this.canvas.getContext('2d');

  this.cellSize = 8; //4
  this.cellSpace = 2; //1
  this.rows = window.innerHeight / (this.cellSize + this.cellSpace); //86
  this.columns = window.innerWidth / (this.cellSize + this.cellSpace); //180

  this.clearWorld();

  return this;

};

Canvas.prototype.clearWorld = function clearWorld() {

  // Init ages (Canvas reference)
  this.age = [];

  _.forEach(_.range(this.columns), (i) => {

    this.age[i] = [];

    _.forEach(_.range(this.rows), (j) => {


      this.age[i][j] = 0; // Dead

    });

  });

};

Canvas.prototype.drawWorld = function drawWorld(state) {

  // Dynamic canvas size
  // this.width = 1 + (this.cellSpace * this.columns) + (this.cellSize * this.columns);
  this.width = window.innerWidth;
  this.canvas.setAttribute('width', this.width);

  // this.height = 1 + (this.cellSpace * this.rows) + (this.cellSize * this.rows);
  this.height = window.innerHeight;
  this.canvas.setAttribute('height', this.height);

  // Fill background
  this.context.fillStyle = '#F3F3F3';
  this.context.fillRect(0, 0, this.width, this.height);

  _.forEach(_.range(this.columns), (i) => {

    _.forEach(_.range(this.rows), (j) => {

      if (algorithm.isAlive(i, j, state)) {

        this.drawCell(i, j, true);

      } else {

        this.drawCell(i, j, false);

      }

    });

  });

};

Canvas.prototype.drawCell = function drawCell(i, j, alive) {

  if (alive) {

    if (this.age[i][j] > -1) this.context.fillStyle = Canvas.colors.alive[this.age[i][j] % Canvas.colors.alive.length];

  } else {

    if (this.age[i][j] < 0) {

      this.context.fillStyle = Canvas.colors.trail[(this.age[i][j] * -1) % Canvas.colors.trail.length];

    } else {

      this.context.fillStyle = Canvas.colors.dead;

    }

  }

  this.context.fillRect(this.cellSpace + (this.cellSpace * i) + (this.cellSize * i), this.cellSpace + (this.cellSpace * j) + (this.cellSize * j), this.cellSize, this.cellSize);

};

Canvas.prototype.switchCell = function switchCell(i, j) {

  if (algorithm.isAlive(i, j)) {

    this.changeCelltoDead(i, j);
    algorithm.switchToDead(i, j);

  } else {

    this.changeCelltoAlive(i, j);
    algorithm.switchToAlive(i, j);

  }

};

Canvas.prototype.keepCellAlive = function keepCellAlive(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j]++;
    this.drawCell(i, j, true);

  }

};

Canvas.prototype.changeCelltoAlive = function changeCelltoAlive(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j] = 1;
    this.drawCell(i, j, true);

  }

};

Canvas.prototype.changeCelltoDead = function changeCelltoDead(i, j) {

  if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {

    this.age[i][j] = -this.age[i][j]; // Keep trail
    this.drawCell(i, j, false);

  }

};

// Singleton OOP
export
default new Canvas();