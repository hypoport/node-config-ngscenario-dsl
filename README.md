[![Build Status](https://travis-ci.org/hypoport/node-config-ngscenario-dsl.png)](https://travis-ci.org/hypoport/node-config-ngscenario-dsl.png)

## Introduction

A simple angular-scenario DSL for configuring a node.js backend directly from your e2e-tests. 

It consists of two parts: 

1. A node module providing an HTTP-based API for remote server configuration.
2. An angular-scenario DSL providing a convenient client interface to the HTTP-based API.

__Note__: This library is currently tested against Angular 1.1.5, but it should also work with previous versions.


## Features

- Configure node backend-request behavior from your e2e tests
- Easy-to-use angular-scenario DSL
- Integrates nicely with existing express server configurations

## Getting Started

### Server

#### Install the node module

```
npm install node-config-ngscenario-dsl
```

#### Use it in your server config

```
/*
 * Setup your express app
 */
var express = require('express');
var app = express();
app.use(express.bodyParser()); // <- important

/*
 * Register the node-config-scenario-dsl express handlers
 */
require('node-config-ngscenario-dsl').setup(app);

/*
 * Expose the express app
 */
var http = require('http');
var server = http.createServer(app);
server.listen(2888);
```

### Client

Include [node-config-ngscenario-dsl.js](https://github.com/hypoport/node-config-ngscenario-dsl/blob/master/client-src/node-config-ngscenario-dsl.js) and [jQuery](http://jquery.com) (>=1.9) in your e2e-tests.

__Note__: The jQuery dependency will be removed once Angular 1.2 is released. (See [this issue](https://github.com/hypoport/node-config-ngscenario-dsl/issues/2))

Then start using the DSL in your e2e-tests:

```
// Configure GET requests to url /dummyRequest to respond with status code 500
server().onRequest({ method: 'GET', url: "/dummyRequest" }).respondWith(500);

// run some tests...

// Clear the above request handler
server().clear();

```
## More Information

* See [API Documentation](https://github.com/hypoport/node-config-ngscenario-dsl/wiki/API-Documentation) for a detailed API description.
* Have a look at the [example](https://github.com/hypoport/node-config-ngscenario-dsl/tree/master/int-tests) directory for a complete working example including karma and node server.

## Contributing

* Check for [open issues](https://github.com/hypoport/node-config-ngscenario-dsl/issues) or [open a fresh issue](https://github.com/hypoport/node-config-ngscenario-dsl/issues/new) to start a discussion around a feature idea or a bug.
* There is a Contributor Friendly tag for issues that should be ideal for people who are not very familiar with the codebase yet.
* Fork the repository on Github to start making your changes.
* Write some tests which show that the bug was fixed or that the feature works as expected.
* Send a pull request and bug the maintainer until it gets merged and published. :)
