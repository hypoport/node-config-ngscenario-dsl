var PropertyMatcher = require('./PropertyMatcher').PropertyMatcher;

var createMatcher = function (matcherConfig) {
  if (matcherConfig['matcherType'] === 'property') {
    return new PropertyMatcher(matcherConfig);
  }
  else {
    return null;
  }
};

exports.createMatcher = createMatcher;
