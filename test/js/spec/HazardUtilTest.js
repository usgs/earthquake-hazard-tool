/* global chai, describe, it */
'use strict';

var HazardUtil = require('HazardUtil');


var EPSILON = 1E-20;

var data = require('etc/data'),
    expect = chai.expect;

describe('HazardUtil', function () {
  describe('coallesce', function () {
    it('omits zero values in x-array', function () {
      var expected,
          xIn,
          yIn;

      xIn = [0, 1, 2, 3, 0, 5, 6];
      yIn = [1, 2, 3, 4, 5, 6, 7];
      expected = [[1, 2], [2, 3], [3, 4], [5, 6], [6, 7]];

      expect(HazardUtil.coallesce(xIn, yIn)).to.deep.equal(expected);
    });

    it('omits zero values in y-array', function () {
      var expected,
          xIn,
          yIn;

      xIn = [1, 2, 3, 4, 5, 6, 7];
      yIn = [0, 1, 2, 3, 0, 5, 6];
      expected = [[2, 1], [3, 2], [4, 3], [6, 5], [7, 6]];

      expect(HazardUtil.coallesce(xIn, yIn)).to.deep.equal(expected);
    });

    it('trims to shortest array length', function () {
      expect(HazardUtil.coallesce([1, 2, 3], [1, 2]).length).to.equal(2);
      expect(HazardUtil.coallesce([1, 2], [1, 2, 3]).length).to.equal(2);
    });
  });

  describe('interpolate', function () {
    it('correctly interpolates linearly', function () {
      var result;

      result = HazardUtil.interpolate(0, 0, 1, 1, 0.5);
      expect(result).to.be.closeTo(0.5, EPSILON);
    });
  });

  describe('interpolateCurve', function () {
    it('returns the proper length result', function () {
      var actual,
          expected,
          x,
          x0,
          x1,
          y0,
          y1;

      x = 0.5;
      x0 = 0;
      x1 = 1;
      y0 = [0, 0, 0, 0];
      y1 = [1, 1, 1, 1];

      actual = HazardUtil.interpolateCurve(x0, y0, x1, y1, x);
      expected = [0.5, 0.5, 0.5, 0.5];

      expect(actual.length).to.equal(4);
      expect(actual).to.deep.equal(expected);
    });
  });
});
