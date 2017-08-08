angular.module('myApp').controller('singlePostController',['$rootScope', '$scope', function($rootScope,$scope){
  $scope.currentUser = $rootScope.user.username;
}]);
