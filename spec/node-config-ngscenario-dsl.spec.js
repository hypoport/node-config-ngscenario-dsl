/*
 * Copyright 2013 Hypoport AG
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var nodeConfigNgScenario = require('../lib/node-config-ngscenario-dsl.js');

var request = require('request');
var express = require('express');
var http = require('http');

var baseUrl = "http://127.0.0.1:2888";

describe('Node Config NgScenario', function () {
  var app;
  var server;

  beforeEach(function () {
    app = express();
    app.use(express.bodyParser());
    nodeConfigNgScenario.setup(app);

    server = http.createServer(app);
    server.listen(2888);
  });

  afterEach(function () {
    server.close();
  });

  it('should config node to return a 500 response', function (done) {

    request(baseUrl + "/dummyRequest", function (error, response, body) {
      expect(response.statusCode).toEqual(404);
      done();
    });

    var configRequest = {
      method: "POST",
      url: baseUrl + "/config",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        requestConfig: {method: 'GET', url: "/dummyRequest"},
        statusCode: 500
      })
    };

    request(configRequest, function (error, response, body) {
      expect(response.statusCode).toEqual(200);
      done();
    });

    request(baseUrl + "/dummyRequest", function (error, resonse, body) {
      expect(resonse.statusCode).toEqual(500);
      done();
    });

    request(baseUrl + "/clearConfig", function (error, resonse, body) {
      expect(resonse.statusCode).toEqual(200);
      done();
    });

    request(baseUrl + "/dummyRequest", function (error, response, body) {
      expect(response.statusCode).toEqual(404);
      done();
    });

  });
});
