import {
  init,
  convertToPOJO
}
from '../src/algorithm';
import should from 'should';

export
default

function() {

  describe('init method', () => {

    it('should init the state', () => {

      should(init()).be.Array;
      should(init()).be.Empty;

    });

  });

  describe('convertToPOJO method', () => {

    it('should return {} on no input', () => {

      should(convertToPOJO()).be.eql({});

    });

    it('should return {} on input != than Array', () => {

      should(convertToPOJO(12)).be.eql({});
      should(convertToPOJO(true)).be.eql({});
      should(convertToPOJO("")).be.eql({});
      should(convertToPOJO(.23)).be.eql({});
      should(convertToPOJO({})).be.eql({});

    });

    it('should return {} on input != array of arrays', () => {

      should(convertToPOJO([
        []
      ])).be.eql({});
      should(convertToPOJO([1])).be.eql({});

    });

    it('should return POJO on input == array of arrays', () => {

      should(convertToPOJO([
        [1]
      ])).be.eql({
        '1': []
      });

      should(convertToPOJO([
        [1, 2]
      ])).be.eql({
        '1': [2]
      });

      should(convertToPOJO([
        [1, 2, 3]
      ])).be.eql({
        '1': [2, 3]
      });

      should(convertToPOJO([
        [1, 3, 2]
      ])).be.eql({
        '1': [2, 3]
      });

      should(convertToPOJO([
        [1],
        [2]
      ])).be.eql({
        '1': [],
        '2': []
      });

      should(convertToPOJO([
        [1],
        [1, 2, 3],
        [1]
      ])).be.eql({
        '1': []
      });

      should(convertToPOJO([
        [50, 1, 10, 4],
        [39, 100, 110]
      ])).be.eql({
        '39': [100, 110],
        '50': [1, 4, 10]
      });

    });

  });

}