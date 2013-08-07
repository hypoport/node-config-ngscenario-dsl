/*
 * Copyright 2013 Hypoport AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

angular.scenario.dsl('server', function () {
    var makeRequest = function (url, data, done, successFn) {
      jQuery.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: successFn || function () {
          done();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          done(textStatus, errorThrown);
        }});
    };

    var serverApi = {};

    serverApi.onRequest = function (requestConfig) {
      var onRequestApi = {};

      onRequestApi.neverRespond = function () {
        return this.addFutureAction('configure a request timeout', function ($window, $document, done) {
          jQuery.ajax({
            type: 'post',
            url: '/config',
            contentType: 'application/json',
            data: JSON.stringify({
              requestConfig: requestConfig,
              generateTimeout: true
            }),
            success: function () {
              done();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              done(textStatus, errorThrown);
            }
          });
        });
      };

      onRequestApi.respondWith = function (statusCode, response) {
        return this.addFutureAction('configure a server response', function ($window, $document, done) {
          jQuery.ajax({
            type: 'post',
            url: '/config',
            contentType: 'application/json',
            data: JSON.stringify({
              statusCode: statusCode,
              requestConfig: requestConfig,
              response: response
            }),
            success: function () {
              done();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              done(textStatus, errorThrown);
            }
          });
        });
      };

      return onRequestApi;
    };

    serverApi.clear = function () {
      return this.addFutureAction('clear node', function ($window, $document, done) {
        jQuery.ajax({
          type: 'get',
          url: '/clearConfig',
          success: function () {
            done();
          },
          error: function () {
            done(null, 'error');
          }
        });
      });
    };

    serverApi.expectRequest = function (expectConfig) {
      return this.addFutureAction('configure a expected request', function ($window, $document, done) {
        makeRequest('/expectRequest', {expectConfig: expectConfig}, done);
      });
    };

    serverApi.hasReceived = function (expectConfig) {
      var reqCount;

      this.addFutureAction('getting request invocationCount', function ($window, $document, done) {
        makeRequest('/hasReceived', {expectConfig: expectConfig}, done, function (response) {
          reqCount = parseInt(response);
          done();
        });
      });

      var hasReceivedApi = {};
      hasReceivedApi.once = function () {
        return this.addFutureAction('request is made once', function ($window, $document, done) {
          if (reqCount !== 1) {
            done("Expected one request, but received " + reqCount);
          }
          else {
            done(null, true);
          }
        });
      };

      hasReceivedApi.never = function () {
        return this.addFutureAction('request is never made', function ($window, $document, done) {
          if (reqCount !== 0) {
            done("Expected no request, but received " + reqCount);
          }
          else {
            done(null, true);
          }
        });
      }

      hasReceivedApi.times = function (times) {
        return this.addFutureAction('request is made n times', function ($window, $document, done) {
          if (reqCount !== times) {
            done("Expected " + times + " requests, but received " + reqCount);
          }
          else {
            done(null, true);
          }
        });
      }

      return hasReceivedApi;
    }

    return function () {
      return serverApi;
    };
  }
)
