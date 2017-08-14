angular.module('myApp').controller('friendRequestsController', ['$rootScope', '$state', '$stateParams','$scope', 'users', function($rootScope, $state,$stateParams, $scope, users){
  var request = {
    username: $rootScope.user.username
  }


  users.getFriendRequests(request).then(function(response){
    if(response.friendRequests){
      $scope.friendRequests = response.friendRequests;
    }
    else{
      $scope.noFriendRequests = response.noFriendRequests;
    }
  })

  $scope.confirmFriend = function(friendConfirming){
    var friendRequest = {
      userOneUserName: request.username,
      userTwoUserName: friendConfirming,
    }

    users.confirmFriend(friendRequest).then(function(response){
      $state.reload();
    })
  }
}])
