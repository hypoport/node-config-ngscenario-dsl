module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var initConfig = {

    jasmine_node: {
      projectRoot: "./",
      requirejs: false,
      forceExit: true,
      jUnit: true,
      coffee: false
    },
    karma: {
      e2e: {
        configFile: 'examples/karma.conf.js'
      }
    }
  };

  grunt.initConfig(initConfig);

  grunt.registerTask('start-int-test-webserver', 'Start the web server for int-tests.', function () {
    require('./examples/server.js');
  });

  grunt.registerTask('int-test', [
    'start-int-test-webserver',
    'karma:e2e'
  ]);

  grunt.registerTask('test',['jasmine_node','int-test'])
  grunt.registerTask('default', ['test']);

};