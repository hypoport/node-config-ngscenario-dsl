basePath = '.';

files = [
  'lib/jquery-1.10.2.min.js',
  'lib/angular-scenario.js',
  ANGULAR_SCENARIO_ADAPTER,
  '../client-src/node-config-ngscenario-dsl.js',
  'client.js'
];

autoWatch = true;

browsers = ['Chrome'];

singleRun = true;

proxies = {
  '/': 'http://127.0.0.1:2888/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
