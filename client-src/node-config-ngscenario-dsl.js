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
  var serverApi = {};

  serverApi.onRequest = function (requestConfig) {
    var onRequestApi = {};

    onRequestApi.respondWith = function (statusCode, response) {
      return this.addFutureAction('configuring server', function ($window, $document, done) {
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

  return function () {
    return serverApi;
  };
})
