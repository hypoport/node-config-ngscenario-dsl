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

function createRequestConfig(method, statusCode, url) {
  return {
    method: 'POST',
    url: baseUrl + '/config',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requestConfig: {
        method: method || 'GET',
        url: url
      },
      statusCode: statusCode
    })
  };
}

describe('Node Config NgScenario', function () {
  var app;
  var server;

  describe('given a server with existing routes', function () {
    beforeEach(function () {
      app = express();
      app.use(express.bodyParser());
      nodeConfigNgScenario.setup(app);

      app.get('/*', function (req, res) {
        res.set('Content-Type', 'text/plain');
        res.send(200, 'Catch-all');
      });

      server = http.createServer(app);
      server.listen(2888);
    });

    afterEach(function () {
      server.close();
    });

    describe('when a request is configured', function () {
      beforeEach(function (done) {
        var configRequest = createRequestConfig('GET', 500, '/dummyRequest');
        request(configRequest, function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      describe('and then cleared', function () {
        beforeEach(function (done) {
          request(baseUrl + "/clearConfig", function (error, resonse, body) {
            expect(resonse.statusCode).toEqual(200);
            done();
          });
        });
        it('should restore the original state', function (done) {
          request(baseUrl + "/dummyRequest", function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            expect(body).toEqual('Catch-all');
            done();
          });
        });
      });
    });
  });

  describe('given a server without any routes', function () {
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

    it('should return 404 for dummy request', function (done) {
      request(baseUrl + "/dummyRequest", function (error, response) {
        expect(response.statusCode).toEqual(404);
        done();
      });
    });

    describe('when a dummy request handler gets configured', function () {
      beforeEach(function (done) {
        var configRequest = createRequestConfig('GET', 500, '/dummyRequest');
        request(configRequest, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      afterEach(function (done) {
        request(baseUrl + "/clearConfig", function (error, resonse) {
          expect(resonse.statusCode).toEqual(200);
          done();
        });
      });

      it('a request to it should return the configured response', function (done) {
        request(baseUrl + "/dummyRequest", function (error, resonse) {
          expect(resonse.statusCode).toEqual(500);
          done();
        });
      });
    });
  });
});
