var express = require('express');
var http = require('http');
var nodeConfigNgScenario = require('../lib/node-config-ngscenario-dsl.js');

var app;
var server;

app = express();
app.use(express.bodyParser());


app.use(express.static(__dirname + '/page'));

nodeConfigNgScenario.setup(app);

server = http.createServer(app);
server.listen(2888);
