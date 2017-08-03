'use strict';

var state = {
  timeInterval: 300
};

function get(name, value) {
  return state[name] || set(name, value) ;
}

function set(name, value) {
  return state[name] = value;
}

export
default  {

  get: get,
  set: set

}