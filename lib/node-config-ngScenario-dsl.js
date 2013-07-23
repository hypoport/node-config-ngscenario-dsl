var _ = require('underscore');

var configRouteCountByMethod = {};

exports.setup = function (app) {

  app.all('*', function (req, res, next) {
//    console.log('req:' + req.url);
    next();
  });

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

    var lastIx = app.routes[method].length - 1;
    var tmp = app.routes[method][0];
    app.routes[method][0] = app.routes[method][lastIx];
    app.routes[method][lastIx] = tmp;

    configRouteCountByMethod[method] = configRouteCountByMethod[method] || 0;
    configRouteCountByMethod[method]++;
    console.log('config success');
    res.writeHead(200);
    res.end();
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    next();
  });
};