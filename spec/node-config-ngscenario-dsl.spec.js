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
var TestRequestHelpers = require('./TestRequestHelpers').TestRequestHelpers(baseUrl);

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
        var configRequest = TestRequestHelpers.createRequestConfig('GET', 500, '/dummyRequest');
        request(configRequest, function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      describe('and then cleared', function () {
        beforeEach(function (done) {
          TestRequestHelpers.makeClearConfigRequest(done);
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

    describe('when a request is expected', function () {

      describe('should count the number of times the request is received', function () {

        it('for two request on the same url', function (done) {

          request(TestRequestHelpers.createExpectRequest('GET', '/testUrl'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            done();
          });

          TestRequestHelpers.makeRequest('/testUrl', 200, done);
          TestRequestHelpers.makeRequest('/testUrl', 200, done);

          request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            expect(parseInt(response.body)).toEqual(2);
            done();
          });

        });

        it('for one request and two requests on different urls', function (done) {

          request(TestRequestHelpers.createExpectRequest('GET', '/testUrl1'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            done();
          });

          request(TestRequestHelpers.createExpectRequest('GET', '/testUrl2'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            done();
          });

          TestRequestHelpers.makeRequest('/testUrl1', 200, done);
          TestRequestHelpers.makeRequest('/testUrl2', 200, done);
          TestRequestHelpers.makeRequest('/testUrl2', 200, done);

          request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl1'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            expect(parseInt(response.body)).toEqual(1);
            done();
          });

          request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl2'), function (error, response, body) {
            expect(response.statusCode).toEqual(200);
            expect(parseInt(response.body)).toEqual(2);
            done();
          });

        });

      });

      it('should forwared the request to the original middleware', function (done) {
        request(baseUrl + "/testUrl", function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body).toEqual('Catch-all');
          done();
        });
      });

      it('should stop counting after clearConfig', function (done) {
        TestRequestHelpers.makeClearConfigRequest(done);
        TestRequestHelpers.makeRequest('/testUrl', 200, done);
        request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl'), function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(0);
          done();
        });
      });

      it('should reset the counter after clearConfig', function (done) {
        TestRequestHelpers.makeRequest('/testUrl', 200, done);
        TestRequestHelpers.makeRequest('/testUrl', 200, done);
        TestRequestHelpers.makeClearConfigRequest(done);
        request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl'), function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(0);
          done();
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
      TestRequestHelpers.makeRequest("/dummyRequest", 404, done);
    });

    describe('when a dummy request handler gets configured', function () {
      beforeEach(function (done) {
        var configRequest = TestRequestHelpers.createRequestConfig('GET', 500, '/dummyRequest');
        request(configRequest, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      afterEach(function (done) {
        TestRequestHelpers.makeClearConfigRequest(done);
      });

      it('a request to it should return the configured response', function (done) {
        TestRequestHelpers.makeRequest("/dummyRequest", 500, done);
      });
    });

    describe('when a timeout gets configured', function () {
      beforeEach(function (done) {
        var configRequest = TestRequestHelpers.createTimeoutConfig('GET', '/dummyRequest');
        request(configRequest, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      afterEach(function (done) {
        TestRequestHelpers.makeClearConfigRequest(done);
      });

      it('should generate a timeout', function (done) {
        request({
          method: 'GET',
          url: baseUrl + "/dummyRequest",
          timeout: 3000
        }, function (error, response) {
          expect(error.code).toMatch(/ETIMEDOUT|ESOCKETTIMEDOUT/);
          done()
        });
      });

    });

  });

  describe('The cache-control response header', function () {

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

    it('should be set for the config request', function (done) {
      request(TestRequestHelpers.createRequestConfig('GET', 500, '/dummyRequest'), function (error, response, body) {
        expect(response.headers['cache-control']).toEqual('no-cache');
        done();
      });
    });

    it('should be set for the clearConfig request', function (done) {
      request(baseUrl + '/clearConfig', function (error, response, body) {
        expect(response.headers['cache-control']).toEqual('no-cache');
        done();
      });
    });

    it('should be set for the hasReceive request', function (done) {
      request(TestRequestHelpers.createHasReceivedRequest('GET', '/testUrl'), function (error, response, body) {
        expect(response.headers['cache-control']).toEqual('no-cache');
        done();
      });
    });

    it('should be set for the expectRequest request', function (done) {
      request(TestRequestHelpers.createExpectRequest('GET', '/testUrl'), function (error, response, body) {
        expect(response.headers['cache-control']).toEqual('no-cache');
        done();
      });
    });

    it('should be set for a registered request', function (done) {

      request(TestRequestHelpers.createRequestConfig('GET', 200, '/dummyRequest'), function (error, response) {
        expect(response.statusCode).toEqual(200);
        done();
      });

      request(baseUrl + '/dummyRequest', function (error, response) {
        expect(response.statusCode).toEqual(200);
        expect(response.headers['cache-control']).toEqual('no-cache');
        done();
      });
    });
  });
});
