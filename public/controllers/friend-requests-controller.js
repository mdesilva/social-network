angular.module('myApp').controller('friendRequestsController', ['$state','$scope', 'users', function($state, $scope, users){
  users.getFriendRequests($scope.request).then(function(response){
    if(response.friendRequests){
      $scope.friendRequests = response.friendRequests;
    }
    else{
      $scope.noFriendRequests = response.noFriendRequests;
    }
  })

  $scope.confirmFriend = function(friendConfirming){
    $scope.friendRequest = {
      userOneUserName: $scope.request.currentUser,
      userTwoUserName: friendConfirming,
    }

    users.confirmFriend($scope.friendRequest).then(function(response){
      $state.reload();
    })
  }
}])
