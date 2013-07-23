angular.scenario.dsl('server', function () {
  var serverApi = {};

  serverApi.onRequest = function (requestConfig) {
    var onRequestApi = {};

    onRequestApi.respondWith = function (statusCode, response) {
      return this.addFutureAction('configuring server', function ($window, $document, done) {
        jQuery.ajax({
          type: 'post',
          url: '/config',
          contentType: 'application/json',
          data: JSON.stringify({
            statusCode: statusCode,
            requestConfig: requestConfig,
            response: response
          }),
          success: function () {
            done();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            done(textStatus, errorThrown);
          }
        });
      });
    };

    return onRequestApi;
  };

  serverApi.clear = function () {
    return this.addFutureAction('clear node', function ($window, $document, done) {
      jQuery.ajax({
        type: 'get',
        url: '/clear',
        success: function () {
          done();
        },
        error: function () {
          done(null, 'error');
        }
      });
    });
  };

  return function () {
    return serverApi;
  };
})
