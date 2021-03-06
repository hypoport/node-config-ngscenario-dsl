var _ = require('underscore');

exports.PropertyMatcher = function (config) {
  this.callCount = 0;
  this.matches = function (body) {
    var matchesProperties = function (object, config) {
      var matchesAllProperties = true;
      _.forEach(config['properties'], function (value, key) {
        matchesAllProperties = matchesAllProperties && object[key] === value;
      });
      return matchesAllProperties;
    };
    if (_.isArray(body)) {
      var matchesAnyItem = false;
      _.forEach(body, function (item) {
        if (matchesProperties(item, config) === true) {
          matchesAnyItem = true;
        }
      });
      return matchesAnyItem;
    }
    else {
      return matchesProperties(body, config);
    }
  }
};
