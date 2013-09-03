var request = require('request');

exports.TestRequestHelpers = function (baseUrl) {

  var createRequestConfig = function (method, statusCode, url) {
    return {
      method: 'POST',
      url: baseUrl + '/config',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestConfig: {
          method: method,
          url: url
        },
        statusCode: statusCode
      })
    };
  };

  var createTimeoutConfig = function (method, url) {
    return {
      method: 'POST',
      url: baseUrl + '/config',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestConfig: {
          method: method,
          url: url
        },
        generateTimeout: true
      })
    };
  };

  var createExpectRequest = function (method, url, matcher) {
    var body = {
      expectConfig: {
        method: method,
        url: url
      }
    };
    if (matcher) {
      body.expectConfig.requestMatcher = matcher;
    }
    return {
      method: 'POST',
      url: baseUrl + '/expectRequest',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  };

  var createHasReceivedRequest = function (method, url, matcher) {
    var body = {
      expectConfig: {
        method: method,
        url: url
      }
    };
    if (matcher) {
      body.expectConfig.requestMatcher = matcher;
    }
    return {
      method: 'POST',
      url: baseUrl + '/hasReceived',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  };

  var makeRequest = function (relativeUrl, expectedStatus, done) {
    request(baseUrl + relativeUrl, function (error, response) {
      expect(response.statusCode).toEqual(expectedStatus);
      done();
    });
  };

  var makeClearConfigRequest = function (done) {
    makeRequest("/clearConfig", 200, done);
  };

  return {
    makeRequest: makeRequest,
    makeClearConfigRequest: makeClearConfigRequest,
    createHasReceivedRequest: createHasReceivedRequest,
    createExpectRequest: createExpectRequest,
    createTimeoutConfig: createTimeoutConfig,
    createRequestConfig: createRequestConfig
  };

};