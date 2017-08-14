angular.module('myApp').controller('navigationController', ['$scope', '$http', '$state','$rootScope','$interval','auth', function($scope, $http, $state,$rootScope,$interval,auth){
  $scope.searchBox = {}; //initialize search
  $scope.request = {
    currentUser: null
  };

  var refreshNotifications;

  var getNotifications = function(){
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

  var refreshNav = function(){
    $http.get("/api/user/isloggedin").then(function(response){
    if(response.data.status === true){
      $state.go('main');
      $scope.loggedIn = true;
      $scope.request.currentUser = response.data.user.username;
      getNotifications(); //get the user's notifications immediately after verifying they are logged in
      refreshNotifications = $interval(getNotifications, 5000); //then refresh the notifcations every 5 seconds
    }
    else{
      $state.go('login',{loginFailed:true, message:"Your session has expired. Please sign in again."});
    }
  })
}

  refreshNav();

  $scope.$on('logged_in', refreshNav); //when the logged in message is recieved via rootScope, run the function

  $scope.loginUser = function() {
    auth.login($scope.login);
    $scope.login = {}; //clear the login form
  }

  $scope.logOut = function() {
    $interval.cancel(refreshNotifications); //stop refreshing the notifications, as the user has signed out
    refreshNotifications = undefined;
    $scope.loggedIn = false;
    auth.logout();
  }

  $scope.archiveNotifications = function() {
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
