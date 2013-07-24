angular.module('app', [])
  .controller('MainController', function ($scope, $http) {
    $scope.requestUrl = "";
    $scope.responseCode = "";
    $scope.responseBody = "";
    $scope.doSend = function () {
      $http.get($scope.requestUrl)
        .success(function (data, status, headers, config) {
          $scope.responseCode = status;
          $scope.responseBody = data;
        }).
        error(function (data, status, headers, config) {
          $scope.responseCode = status;
          $scope.responseBody = data;
        });
    };
  });