var PropertyMatcher = require('../lib/PropertyMatcher.js').PropertyMatcher;

describe('PropertyMatcher', function () {
  var matcher;
  var matchingObject = {
    foo: 'bar',
    random: 'noise',
    ww: 'heisenberg'
  };
  var nonMatchingObject = {
    random: 'noise'
  };

  describe('when constructed', function () {
    beforeEach(function () {
      matcher = new PropertyMatcher({
        matcherType: 'property',
        properties: {
          foo: 'bar'
        }
      });
    });
    it('should have callCount of 0', function () {
      expect(matcher.callCount).toEqual(0);
    });
  });

  describe('when configured to match single property', function () {
    beforeEach(function () {
      matcher = new PropertyMatcher({
        matcherType: 'property',
        properties: {
          foo: 'bar'
        }
      });
    });
    it('should match array containing matching object', function () {
      expect(matcher.matches([ matchingObject, nonMatchingObject ])).toBeTruthy();
    });
    it("should not match array that doesn't contain matching object", function () {
      expect(matcher.matches([ nonMatchingObject ])).toBeFalsy();
    });
    it('should match matching object', function () {
      expect(matcher.matches(matchingObject)).toBeTruthy();
    });
    it('should not match non-matching object', function () {
      expect(matcher.matches(nonMatchingObject)).toBeFalsy();
    });
  });

  describe('when configured to match multiple properties', function () {
    beforeEach(function () {
      matcher = new PropertyMatcher({
        matcherType: 'property',
        properties: {
          foo: 'bar',
          ww: 'heisenberg'
        }
      });
    });
    it('should only match objects containing all matcher properties', function () {
      expect(matcher.matches({foo: 'bar'})).toBeFalsy();
      expect(matcher.matches({foo: 'bar', ww: 'heisenberg'})).toBeTruthy();
      expect(matcher.matches({foo: 'bar', ww: 'heisenberg', noise: true})).toBeTruthy();
      expect(matcher.matches([
        {foo: 'bar', ww: 'heisenberg'}
      ])).toBeTruthy(); // yes, arrays too
    });
  });

});