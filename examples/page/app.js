angular.module('app', [])
  .controller('MainController', function ($scope, $http) {
    $scope.requestUrl = "";
    $scope.responseCode = "";
    $scope.responseBody = "";
    $scope.doSend = function () {
      $http({
        method: 'GET',
        url: $scope.requestUrl,
        timeout: 5000
      }).
        success(function (data, status, headers, config) {
          $scope.responseCode = status;
          $scope.responseBody = data;
        }).
        error(function (data, status, headers, config) {
          $scope.responseCode = status;
          $scope.responseBody = data;
        });
    };
  });