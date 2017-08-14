angular.module('myApp').controller('userController', ['$scope','users','$state','$stateParams','$rootScope', function($scope,users,$state,$stateParams,$rootScope){

  var request = {
    username: $rootScope.user.username
  }

  if($state.current.name === "viewProfile"){
    var request = {
      username: $stateParams.username
    }
  }

  users.getUserInfo(request).then(function(response){
    $scope.fullname = response.fullname;
  })

}])
