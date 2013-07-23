var express = require('express');
var http = require('http');
var nodeConfigNgScenario = require('../lib/node-config-ngscenario-dsl.js');

var app;
var server;

app = express();
app.use(express.bodyParser());

nodeConfigNgScenario.setup(app);

app.get('/index.html', function (req, res) {
  res.sendfile('index.html');
});

server = http.createServer(app);
server.listen(2888);
