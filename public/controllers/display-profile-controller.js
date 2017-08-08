angular.module('myApp').controller('displayProfileController', ['$scope', '$http', '$state', '$rootScope', 'posts', function($scope, $http, $state, $rootScope,posts){

  $scope.user = $rootScope.user;
  $scope.request= {
    username: $scope.user.username,
    currentUser: $scope.user.username //the user is commenting on their own post
  };

}])
