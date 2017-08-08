angular.module('myApp').controller('signUpController', ['$scope', '$state', '$http', function($scope, $state, $http){

    $scope.createUser = function () {
      $http.post('/api/user/signup', $scope.newUser).then(function(response){
        $scope.message = response.data.status;
      })
    }
  }]);
