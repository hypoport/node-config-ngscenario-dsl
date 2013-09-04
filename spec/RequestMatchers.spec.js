var RequestMatchers = require('../lib/RequestMatchers');
var PropertyMatcher = require('../lib/PropertyMatcher').PropertyMatcher;

describe('RequestMatchers', function () {
  describe('createMatcher', function () {
    describe('when given configuration with matcherType "property"', function () {
      it('should return instance of PropertyMatcher', function () {
        var matcher = RequestMatchers.createMatcher({
          matcherType: 'property',
          properties: {
            foo: 'bar'
          }
        });
        expect(matcher instanceof PropertyMatcher).toBeTruthy();
      });
    });
    describe('when given configuration with unknown matcherType', function () {
      it('should return null', function () {
        var matcher = RequestMatchers.createMatcher({
          matcherType: 'unknown'
        });
        expect(matcher).toBe(null);
      });
    });
  });
});