angular.module('myApp').controller('editProfileController',['$scope','Upload', '$state', '$http', '$rootScope', function($scope, Upload, $state, $http, $rootScope){

  $scope.user = $rootScope.user;

  $scope.upload = function (file) {

      Upload.upload({
        url: '/api/profile/editPhoto',
        method: 'POST',
        data:{userId: $scope.user._id},
        file: file
      }).progress(function(event){
        console.log("The user id is " +  $scope.user._id);
        console.log("firing")}).then(function(response){
          console.log("done!");
    });
  };

  $scope.updateUserInfo = function() {
    var request = { //get the user information
      userId: $scope.user._id,
      username: $scope.user.username,
      bio: $scope.user.bio
    };
    console.log(request);
    $http.post('/api/profile/updateUserInfo', request).then(function(response){ //post the information to the server
      console.log("Updated user info");
    });
  }
}])
