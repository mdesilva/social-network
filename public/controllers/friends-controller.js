angular.module('myApp').controller('friendsController',['$scope', 'users', '$state', '$stateParams','$rootScope', function($scope, users, $state, $stateParams, $rootScope){

  var request = {
    username: $rootScope.user.username
  }

  if($state.current.name === "viewProfile"){
    var request = {
      username: $stateParams.username
    }
  }
  users.getFriends(request).then(function(response){
    $scope.friends = response;
  })
}])
