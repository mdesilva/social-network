var myApp = angular.module('myApp', ['ui.router', 'ngFileUpload']).config(function($stateProvider, $urlRouterProvider){

  var isLoggedIn = function($q,$rootScope, $state, $http) {
    var deferred = $q.defer();
    $http.get("api/user/isloggedin").then(function(response){
      if(response.data.status === true){
        $rootScope.user = response.data.user;
        deferred.resolve()
      }
      else{
        deferred.reject()
      }
    })
    return deferred.promise;

  }

  $urlRouterProvider.otherwise('/'); //if any of following states don't match, automatically show the home state (url: '/');

  $stateProvider
  .state('home', {
    url: "/",
    templateUrl: "public/views/home.html"
  })
  .state('signUp', {
    url: "/signup",
    templateUrl: "public/views/signup.html",
    controller: "authController"
  })
  .state('login', {
    url: "/login",
    templateUrl: "public/views/login.html",
    controller: "authController",
    params: {
      loginFailed: null,
      message: null
    }
  })
  .state('myProfile', {
    url: '/my-profile',
    templateUrl: "public/views/display-profile-view.html",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
  .state('main', {
    url: '/main',
    templateUrl: "public/views/main-view.html",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
  .state('search', {
    url: '/search',
    templateUrl: "public/views/search-view.html",
    params: { //declare params so that you can pass data from one state to the other without url
      results: null
    },
    controller: "searchController"
  })
  .state('viewProfile', {
    url: "/viewProfile/:username",
    templateUrl: "public/views/view-other-profile-view.html",
    controller: "viewOtherProfile"
  })
  .state('viewPost', {
    url: "/posts/:postId",
    templateUrl: "public/views/view-single-post.html",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
});
