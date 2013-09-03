var _ = require('underscore');

var PropertyMatcher = function (config) {
  this.callCount = 0;
  this.matches = function (body) {
    try {
      var matches = true;
      _.forEach(config['properties'], function (value, key) {
        matches &= body[key] === value;
      });
      return matches;
    }
    catch (e) {
      return false;
    }
  }
};

var createMatcher = function (matcherConfig) {
  if (matcherConfig['matcherType'] === 'property') {
    return new PropertyMatcher(matcherConfig);
  }
  else {
    return null;
  }
};

exports.createMatcher = createMatcher;
