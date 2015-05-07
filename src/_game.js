'use strict';

import * as __ from 'processing-js';
import _ from 'lodash';

var GLOBAL_PLAYABLE = true;

var _animation = function(state) {

    state = state || {};

    return _animationHandler(state);
};

var _animationHandler = function(state) {

    state = {

        //Animation controls
        pause: false,
        play: false,
        engine: null,

        //Animation data
        colors: [],
        pixels: [],
        components: [],
        couples: 2,
        size: 5,
        width: 60,
        height: 60,
        rwidth: window.innerWidth,
        rheight: window.innerHeight,
        sketch: null,

    };

    return {

        run: _run(state),
        pause: _pause(state),
        resume: _resume(state),
        stop: _stop(state),
        start: _start(state),
    };

};

var _initState = function(state) {

    var genRandomWhiteColor = function() {

        return (Math.random() * 125) + 130;
    };

    return function() {

        _.forEach(_.range(state.width), function(x) {

            _.forEach(_.range(state.height), function(y) {

                var pixel = {

                    x: x * state.size,
                    y: y * state.size,
                    size: state.size

                };

                /* if (Math.floor(Math.random() * 1000) < 10) {

                     var whiteColorGrade = genRandomWhiteColor();

                     pixel.toR = whiteColorGrade;
                     pixel.toG = whiteColorGrade;
                     pixel.toB = whiteColorGrade;
                     pixel.alive = true;

                 } else {*/

                pixel.toR = 0;
                pixel.toG = 0;
                pixel.toB = 0;
                pixel.alive = false;


                state.pixels.push(pixel);

            });

        });

        _.forEach(_.range(state.couples), function() {

            var random = Math.floor(Math.random() * (_.size(state.pixels)-1));
            var whiteColorGrade = genRandomWhiteColor();

            state.pixels[random].toR = whiteColorGrade;
            state.pixels[random].toG = whiteColorGrade;
            state.pixels[random].toB = whiteColorGrade;
            state.pixels[random].alive = true;

            state.pixels[random+1].toR = whiteColorGrade;
            state.pixels[random+1].toG = whiteColorGrade;
            state.pixels[random+1].toB = whiteColorGrade;
            state.pixels[random+1].alive = true;

        });

    };
};

var _sketch = function(state) {

    return function(sketch) {

        sketch.setup = function() {

            sketch.size(state.rwidth, state.rheight);
            sketch.background(0, 0, 0);
            sketch.fill(0);
            sketch.noStroke();
            sketch.frameRate(2000);
        };

        sketch.mouseMoved = function() {

            state.mx = sketch.mouseX;

            state.my = sketch.mouseY;
        };

        sketch.draw = function() {

            if (state.pause === false) {

                if (state.play && GLOBAL_PLAYABLE) {

                    //sketch.background(0, 0, 0);

                    _.forEach(state.components, function(component) {

                        if (component) component(sketch);

                    });
                }
            }
        };

        state.sketch = sketch;

    };

};

var _canvas = function() {

    return document.getElementById('animation');

};

var _initEngine = function(state) {

    return function(fn) {

        _initSound(state)(fn);

        state.engine = new Processing(_canvas(), _sketch(state));

        state.pause = false;
        state.play = true;

    };

};

var _initListeners = function(state) {

    return function() {

        //Resize options
        window.addEventListener('resize', function() {

            state.rwidth = window.innerWidth;
            state.rheight = window.innerHeight;
            state.sketch.size(state.rwidth, state.rheight);

        });

    };

};

var _run = function(state) {

    _initColors(state)();
    _initComponents(state)();

    return function(fn) {

        _initState(state)();

        _initEngine(state)(fn);

        _initListeners(state)();

    };

};

var _initColors = function(state) {

    return function() {

        var whiteGradient = Math.random() * 255;

        state.colors = [

            {
                r: function() {
                    return Math.random() * 255;
                },
                g: function() {
                    return 0;
                },
                b: function() {
                    return 0;
                }
            }, {
                r: function() {
                    return Math.random() * 255;
                },
                g: function() {
                    return Math.random() * 255;
                },
                b: function() {
                    return Math.random() * 255;
                }
            }, {
                r: function() {
                    return 0;
                },
                g: function() {
                    return Math.random() * 255;
                },
                b: function() {
                    return 0;
                }
            }, {
                r: function() {
                    return 0;
                },
                g: function() {
                    return 0;
                },
                b: function() {
                    return Math.random() * 255;
                }
            }, {
                r: function() {
                    return Math.random() * 255;
                },
                g: function() {
                    return 0;
                },
                b: function() {
                    return Math.random() * 255;
                }
            }, {
                r: function() {
                    return whiteGradient;
                },
                g: function() {
                    return whiteGradient;
                },
                b: function() {
                    return whiteGradient;
                }
            }
        ];
    };
};

var _initComponents = function(state) {

    var universe = function(sketch) {

        var update = function(pixel, neighbours) {

            var count = _.reduce(_.map(neighbours, 'alive'), function(a, b) {
                return a + b;
            });

            if (count < 2 || count > 3) {

                pixel.alive = false;
                pixel.toR = 0;
                pixel.toG = 0;
                pixel.toB = 0;

                return;
            }

            pixel.alive = true;

            var color = state.colors[Math.floor(Math.random() * _.size(state.colors))];

            pixel.toR = color.r();
            pixel.toG = color.g();
            pixel.toB = color.b();

        };

        var neighbours = function(x) {

            var pixels = [];

            var coords = (function getCoords(x) {
                return {
                    col: x % state.width,
                    row: Math.floor(x / state.width)
                }
            })(x);

            var getPixel = function(col, row) {

                if (col < 0 || row < 0) {

                    return;
                }

                var pixel = state.pixels[row * state.width + col];

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

            return pixels;
        };

        _.forEach(state.pixels, function(pixel, i) {

            update(pixel, neighbours(i));

            sketch.fill(Math.floor(pixel.toR), Math.floor(pixel.toG), Math.floor(pixel.toB));
            sketch.rect(pixel.x, pixel.y, pixel.size, pixel.size);

        });

    };

    return function() {

        state.components = [universe];
    };
};


var _initSound = function() {

    return function(fn) {

        var audio = new Audio();
        var canPlayType = audio.canPlayType("audio/ogg");

        if (typeof HTMLAudioElement == 'object' || typeof HTMLAudioElement ==
            'function') {

            if (canPlayType.match(/maybe|probably/i)) {

                audio.src = 'assets/sound/sound.ogg';

            } else {

                audio.src = 'assets/sound/sound.mp3';

            }

            audio.addEventListener('canplay', function() {

                audio.play();

            });

            audio.addEventListener('ended', function() {

                audio.currentTime = 0;
                audio.play();

            });

            fn();

        } else {

            fn();
        }

    };

};

var _pause = function(state) {

    return function() {

        state.pause = true;

    };

};

var _resume = function(state) {

    return function() {

        state.pause = false;

    };

};

var _stop = function(state) {

    return function() {

        state.pause = true;
        state.play = false;
        state.sketch.fill(0);
        state.sketch.rect(0, 0, state.width, state.height);
    }

};

var _start = function(state) {

    return function() {

        state.pause = false;
        state.play = true;

        _initState(state)();

    };

};

export
var animation = _animation();
