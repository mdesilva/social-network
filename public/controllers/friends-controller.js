angular.module('myApp').controller('friendsController',['$scope', 'users', '$state',function($scope, users, $state){
  users.getFriends($scope.request).then(function(response){
    $scope.friends = response;
  })
}])
