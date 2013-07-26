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

var configRouteCountByMethod = {};

exports.setup = function (app) {

  app.get('/clearConfig', function (req, res) {
    _.each(configRouteCountByMethod, function (count, method) {
      app.routes[method] = app.routes[method].slice(count);
    });
    configRouteCountByMethod = {};
    res.writeHead(200);
    res.end();
  });

  app.post('/config', function (req, res) {
    var requestConfig = req.body.requestConfig;
    var response = req.body.response || {};
    var statusCode = req.body.statusCode;

    var method = requestConfig.method.toLowerCase();

    app[method](requestConfig.url, function (req, res) {
      _.each(response.headers, function (value, key) {
        res.setHeader(key, value);
      });
      res.send(statusCode, response.data);
      res.end();
    });

    var newRoute = app.routes[method].pop();
    app.routes[method].splice(0, 0, newRoute);

    configRouteCountByMethod[method] = configRouteCountByMethod[method] || 0;
    configRouteCountByMethod[method]++;
    res.writeHead(200);
    res.end();
  });
};