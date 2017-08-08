angular.module('myApp').controller('userController', ['$scope','users','$state', function($scope,users,$state){

  users.getUserInfo($scope.request).then(function(response){
    $scope.fullname = response.fullname;
  })

}])
