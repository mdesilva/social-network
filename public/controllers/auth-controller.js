angular.module('myApp').controller('authController', ['$scope', '$state', '$http', 'auth', '$stateParams', function($scope, $state, $http,auth,$stateParams){

    if($stateParams.loginFailed === true){
      $scope.alert = $stateParams.message;
    }

    $scope.createUser = function () {
      $http.post('/api/user/signup', $scope.newUser).then(function(response){
        $scope.message = response.data.status;
      })
    }

    $scope.loginUser = function(){
      auth.login($scope.login)
    }

  }]);
