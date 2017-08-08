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
    controller: "signUpController"
  })
  .state('editProfile', {
    url: "/edit-profile",
    templateUrl: "public/views/edit-profile-view.html",
    controller: "editProfileController",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
  .state('myProfile', {
    url: '/my-profile',
    templateUrl: "public/views/display-profile-view.html",
    controller: "displayProfileController",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
  .state('main', {
    url: '/main',
    templateUrl: "public/views/main-view.html",
    controller: "mainController",
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
  /*.state('viewProfile', {
    url: "/viewProfile/:id", //declare dynamic parameter in the url itself
    templateUrl: "public/profile/view-other-profile-view.html",
    controller: "viewOtherProfile"
  }) */
  .state('viewProfile', {
    url: "/viewProfile/:username",
    templateUrl: "public/views/view-other-profile-view.html",
    controller: "viewOtherProfile"
  })
  .state('viewPost', {
    url: "/posts/:postId",
    templateUrl: "public/views/view-single-post.html",
    controller: "singlePostController",
    resolve: {
      checkLoggedIn: isLoggedIn
    }
  })
});
