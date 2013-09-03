var nodeConfigNgScenario = require('../lib/node-config-ngscenario-dsl.js');
var request = require('request');
var express = require('express');
var http = require('http');
var baseUrl = "http://127.0.0.1:2888";
var TestRequestHelpers = require('./TestRequestHelpers').TestRequestHelpers(baseUrl);

describe('Node Server with node-config-ng-scenario extension:', function () {
  var app, server;

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

  describe('given a request matcher', function () {
    beforeEach(function (done) {
      request(TestRequestHelpers.createRequestConfig('POST', 200, '/log'), function (error, response) {
        expect(response.statusCode).toEqual(200);
        done();
      });
      request(TestRequestHelpers.createExpectRequest('POST', '/log', {matcherType: 'property', properties: {level: 'INFO'}}), function (error, response) {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });

    afterEach(function (done) {
      TestRequestHelpers.makeClearConfigRequest(done);
    });

    describe('when one request with matching and one with non-matching request matcher is performed', function () {
      beforeEach(function (done) {
        request({
          method: 'POST',
          url: baseUrl + '/log',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 'bar', level: 'ERROR' })
        }, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
        request({
          method: 'POST',
          url: baseUrl + '/log',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 'bar', level: 'INFO' })
        }, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      it('should increment the number of calls to the URL', function (done) {
        request(TestRequestHelpers.createHasReceivedRequest('POST', '/log'), function (error, response) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(2);
          done();
        });
      });

      it('should increment the number of calls for the matching request matcher', function (done) {
        request(TestRequestHelpers.createHasReceivedRequest('POST', '/log', {matcherType: 'property', properties: {level: 'INFO'}}), function (error, response) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(1);
          done();
        });
      });
    });

    describe('when matching request is performed', function () {
      beforeEach(function (done) {
        request({
          method: 'POST',
          url: baseUrl + '/log',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foo: 'bar', level: 'INFO' })
        }, function (error, response) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });

      it('should increment the number of calls to the URL', function (done) {
        request(TestRequestHelpers.createHasReceivedRequest('POST', '/log'), function (error, response) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(1);
          done();
        });
      });

      it('should increment the number of calls for the specific request matcher', function (done) {
        request(TestRequestHelpers.createHasReceivedRequest('POST', '/log', {matcherType: 'property', properties: {level: 'INFO'}}), function (error, response) {
          expect(response.statusCode).toEqual(200);
          expect(parseInt(response.body)).toEqual(1);
          done();
        });
      });
    });

  });
});
