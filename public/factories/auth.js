var app = angular.module('myApp');

app.factory('auth',function($rootScope,$http,$state){
  var factory = {};

  factory.login = function(request){
    return $http.post("/api/user/login",request).then(function(response){
      $rootScope.$broadcast('logged_in'); //upon successful response, broadcast to the rootScope that the user is logged in.
    },function(error){ //else redirect to login page and display login failure message
      $state.go('login', {loginFailed:true, message: "The username or password you entered is incorrect. Please try again"});
    })
  }

  factory.logout = function() {
    return $http.get("/logout").then(function(response){
      $rootScope.$broadcast('stop_posts_refresh'); //on successful logout, broadcast to the rootScope to stop posts refresh.
      $state.go('home');
    })
  }

  factory.getUser = function(){
    console.log("Request to get user");
    //return the username of the current user
    return $http.get("/api/user/isloggedin").then(function(response){
      this.username = response.data.user.username;
      var user = {
        username: this.username
      }
      return user;
    })
  }

  return factory;
});
