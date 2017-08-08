angular.module('myApp').controller('mainController', ['$scope', '$http', '$interval', '$rootScope', function($scope, $http, $interval, $rootScope){
  $scope.user = $rootScope.user;
  $scope.request = {
    username: $scope.user.username,
    currentUser: $scope.user.username,
  };
}])
