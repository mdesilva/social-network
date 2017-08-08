angular.module('myApp').controller('viewOtherProfile', ['$scope', '$state', '$stateParams', '$http', '$rootScope', function($scope, $state, $stateParams, $http, $rootScope){

  //userOne is the current user who is logged in
  //userTwo is the user profile that is being viewed.

  $scope.userOne = $rootScope.user.username;
  $scope.userTwo = $stateParams.username;  //get the dynamic param that is passed into the url

  if($scope.userOne === $scope.userTwo){ //redirect to current user's own private profile page if requests to view public profile for himself
    $state.go('myProfile')
  };

  $scope.request = {
    username: $scope.userTwo, //we want to get the details and posts of the user profile that is being viewed
    currentUser: $scope.userOne //if we are commenting on a post, we are commenting as the user that is logged in
  };


  var friendRequest ={ //userTwo is adding userOne
    userOneUserName: $scope.userOne,
    userTwoUserName: $scope.userTwo
  }


  $http.post("/api/profile/checkRelationship", friendRequest).then(function(response){
    $scope.status = response.data.status;
    $scope.action = response.data.action;
});



  $scope.manageFriend = function (action) {
    var route = "/api/profile/" + action;
    $http.post(route, friendRequest).then(function(response){
      //console.log(response.data);
      $state.reload();
    })
  }


}]);
