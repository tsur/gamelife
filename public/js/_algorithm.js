'use strict';

import _ from 'lodash';

function game(state) {

    state = state || {};

    return gameHandler(state);
};

function gameHandler(state) {

    state = {

        pixels: [],
        size: 10,
        cols: 10,
        rows: 10,
        couples: 5

    };

    return run(state);
};

function initState(state) {

    var genRandomWhiteColor = function() {

        return (Math.random() * 125) + 130;
    };

    return function() {

        _.forEach(_.range(state.cols), function(x) {

            _.forEach(_.range(state.rows), function(y) {

                var pixel = {

                    x: x * state.size,
                    y: y * state.size,
                    size: state.size,
                    alive: false

                };

                pixel.toR = 0;
                pixel.toG = 0;
                pixel.toB = 0;

                state.pixels.push(pixel);

            });

        });

        console.log('total pixels', _.size(state.pixels));

        _.forEach(_.range(state.couples), function() {

            var random = Math.floor(Math.random() * _.size(state.pixels));
            var whiteColorGrade = genRandomWhiteColor();

            state.pixels[random].toR = whiteColorGrade;
            state.pixels[random].toG = whiteColorGrade;
            state.pixels[random].toB = whiteColorGrade;
            state.pixels[random].alive = true;

            state.pixels[random+1].toR = whiteColorGrade;
            state.pixels[random+1].toG = whiteColorGrade;
            state.pixels[random+1].toB = whiteColorGrade;
            state.pixels[random+1].alive = true;

            console.log(random, 'pixel alive');
        });

    };
};

function run(state) {

    initState(state)();

    return logic(state);

};

function logic(state) {

    return function() {

        var update = function(pixel, neighbours) {

            var count = _.reduce(_.map(neighbours, 'alive'), function(a, b) {
                return a + b;
            });

            console.log('alives', count);

            if (count < 2 || count > 3) {

                pixel.alive = false;
                pixel.toR = 0;
                pixel.toG = 0;
                pixel.toB = 0;

                return;
            }


            pixel.alive = true;

        };

        var neighbours = function(x) {

            var pixels = [];

            var coords = (function getCoords(x) {
                return {
                    col: x % state.cols,
                    row: Math.floor(x / state.cols)
                }
            })(x);

            console.log('pixel '+x, coords.col, coords.row);

            var getPixel = function(col, row) {

                if (col < 0 || row < 0) {

                    return;
                }

                var pixel = state.pixels[row * state.cols + col];

                if (pixel) pixels.push(pixel);
            };

            getPixel(coords.col - 1, coords.row - 1);
            getPixel(coords.col - 1, coords.row);
            getPixel(coords.col - 1, coords.row + 1);
            getPixel(coords.col, coords.row - 1);
            getPixel(coords.col, coords.row + 1);
            getPixel(coords.col + 1, coords.row - 1);
            getPixel(coords.col + 1, coords.row);
            getPixel(coords.col + 1, coords.row + 1);

            console.log('total', _.size(pixels));

            return pixels;
        };

        _.forEach(state.pixels, function(pixel, i) {

            update(pixel, neighbours(i));

        });
    };
};

var myGame = game();

myGame();
