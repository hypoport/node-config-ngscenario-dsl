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

var _ = require('underscore');
var RequestTracker = require('./RequestTracker').RequestTracker;

exports.setup = function (app) {

  var expectedRequests = { };
  var routeEntriesCountByMethod = {};

  var moveNewMiddlewareToFirstPositionInRoutes = function (method) {
    var newRoute = app.routes[method].pop();
    app.routes[method].splice(0, 0, newRoute);
  };

  var newRouteEntryToRemove = function (method) {
    routeEntriesCountByMethod[method] = routeEntriesCountByMethod[method] || 0;
    routeEntriesCountByMethod[method]++;
  };

  app.get('/clearConfig', function (req, res) {
    _.each(routeEntriesCountByMethod, function (count, method) {
      app.routes[method] = app.routes[method].slice(count);
    });
    expectedRequests = {};
    routeEntriesCountByMethod = {};
    res.set('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end();
  });

  app.post('/expectRequest', function (req, res) {
    var expectConfig = req.body.expectConfig;

    var method = expectConfig.method.toLowerCase();
    var url = expectConfig.url;

    expectedRequests[method] = expectedRequests[method] || {};
    expectedRequests[method][url] = expectedRequests[method][url] || new RequestTracker();
    expectedRequests[method][url].registerMatcher(expectConfig['requestMatcher']);

    app[method](url, function (req, res, next) {
      expectedRequests[method][url].callCount++;
      var matchers = expectedRequests[method][url].matchersForRequest(req.body, req.headers);
      _.forEach(matchers, function (matcher) {
        matcher.callCount++;
      });
      next();
    });

    moveNewMiddlewareToFirstPositionInRoutes(method);
    newRouteEntryToRemove(method);
    res.set('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end();
  });

  app.post('/hasReceived', function (req, res) {
    var expectConfig = req.body.expectConfig;
    var requestHandlersByUrl = expectedRequests[expectConfig.method.toLowerCase()];
    var count = 0;
    if (requestHandlersByUrl) {
      var requestHandler = requestHandlersByUrl[expectConfig.url];
      if (requestHandler) {
        if (expectConfig['requestMatcher']) {
          count = requestHandler.callCountForMatcher(expectConfig['requestMatcher']);
        }
        else {
          count = requestHandler.callCount;
        }
      }
    }

    res.set('Cache-Control', 'no-cache');
    res.send(200, count.toString());
    res.end();
  });

  app.post('/config', function (req, res) {
    var requestConfig = req.body.requestConfig;
    var response = req.body.response || {};
    var statusCode = req.body.statusCode;
    var generateTimeout = req.body.generateTimeout;

    var method = requestConfig.method.toLowerCase();

    if (generateTimeout) {
      app[method](requestConfig.url, function (req, res) {
      });
    }
    else {
      app[method](requestConfig.url, function (req, res) {
        _.each(response.headers, function (value, key) {
          res.setHeader(key, value);
        });
        res.set('Cache-Control', 'no-cache');
        res.send(statusCode, response.data);
        res.end();
      });
    }

    moveNewMiddlewareToFirstPositionInRoutes(method);
    newRouteEntryToRemove(method);

    res.set('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end();
  });
};