var _ = require('underscore');

var RequestMatchers = require('./RequestMatchers');

var RequestTracker = function () {
  var matchers = {};

  this.registerMatcher = function (matcherConfig) {
    if (matcherConfig) {
      matchers[JSON.stringify(matcherConfig)] = RequestMatchers.createMatcher(matcherConfig);
    }
  };

  this.matchersForRequest = function (body, headers) {
    var matchingMatchers = [];
    _.forEach(matchers, function (matcher) {
      if (matcher.matches(body, headers)) {
        matchingMatchers.push(matcher);
      }
    });
    return matchingMatchers;
  };

  this.callCountForMatcher = function (rawMatcher) {
    var matcherAsJsonString = JSON.stringify(rawMatcher);
    var matcher = matchers[matcherAsJsonString];
    return matcher ? matcher.callCount : 0;
  };

  this.callCount = 0;
};

exports.RequestTracker = RequestTracker;