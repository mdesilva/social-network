var app = angular.module('myApp');

app.factory('users', function($http){
  var factory = {};

  factory.getUserInfo = function(request){
    return $http.post("/api/profile/getUserInfo",request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.getFriends = function(request){
    return $http.post("/api/profile/getFriends",request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.getFriendRequests = function(request){
    return $http.post("/api/profile/getFriendRequests",request).then(function(response){
      this.response = response.data; //the server will send either noFriendRequests or friendRequests; bind to whatever response is sent
      return this.response;
    })
  }

  factory.confirmFriend = function(request){
    return $http.post("/api/profile/confirmFriend", request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  return factory;
})
