angular.module('myApp').controller('navigationController', ['$scope', '$http', '$state','$rootScope','$interval', function($scope, $http, $state,$rootScope,$interval){
  $scope.searchBox = {}; //initialize search
  $scope.notifications;
  $scope.notificationsLength;
  $scope.request = {
    currentUser: null
  };

  $scope.getNotifications = function(){
    $http.post("/api/profile/getNotifications", $scope.request).then(function(response){
      if(response.data.notifications){
        $scope.notifications = response.data.notifications;
        $scope.notificationsLength = response.data.length;
      }
      else{
        $scope.notifications = false;
        $scope.noNotifications = response.data.noNotifications;
      }
    })
  }

  $http.get("/api/user/isloggedin").then(function(response){
    if(response.data.status === true){
      $scope.loggedIn = true;
      $scope.request.currentUser = response.data.user.username;
      $scope.getNotifications(); //get the user's notifications immediately after verifying they are logged in
      $interval($scope.getNotifications, 5000) //then refresh the notifcations every 5 seconds
    }
    else{
      $scope.loggedIn = false;
      $scope.currentUser = null;
    }
  })

  $scope.loginUser = function() {
    $http.post("api/user/login", $scope.login).then(function(response){
      $scope.logInStatus = "";
      $scope.loggedIn = true;
      $state.go('main');
    })
  }

  $scope.logOut = function() {
    $http.get("/logout").then(function(response){
      $state.go('home');
      $scope.logInStatus = "Successfully logged out";
      $scope.loggedIn = false;
    })

  }


  $scope.archiveNotifications = function() {
    console.log($scope.request);
    var request = {
      currentUser: $scope.request.currentUser,
      notifications: $scope.notifications
    }
    $http.post("api/profile/archiveNotifications", request).then(function(response){
      $scope.notificationsLength = 0;
      $scope.notifications = false;
    })
  }

  $scope.search = function() {
    var query = $scope.searchBox;
    //console.log("Searching for " + query.query);
    $http.post("api/search", query).then(function(response){
      //$scope.searchBox = {};
      $state.go('search', {results: response.data});
    })
  }

}]);
