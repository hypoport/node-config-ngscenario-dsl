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

exports.setup = function (app) {

  var routeEntriesCountByMethod = {};

  var receivedRequestCountByExpectConfig = {};

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
    routeEntriesCountByMethod = {};
    receivedRequestCountByExpectConfig = {};
    res.set('Cache-Control', 'no-cache');
    res.writeHead(200);
    res.end();
  });

  app.post('/expectRequest', function (req, res) {
    var expectConfig = req.body.expectConfig;
    var method = expectConfig.method.toLowerCase();

    app[method](expectConfig.url, function (req, res, next) {
      receivedRequestCountByExpectConfig[expectConfig] = receivedRequestCountByExpectConfig[expectConfig] || 0;
      receivedRequestCountByExpectConfig[expectConfig]++;
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
    var count = receivedRequestCountByExpectConfig[expectConfig] || 0;
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