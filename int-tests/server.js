var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + '/page'));

var nodeConfigNgScenario = require('../lib/node-config-ngscenario-dsl.js');
nodeConfigNgScenario.setup(app);

var http = require('http');
var server = http.createServer(app);
server.listen(2888);
