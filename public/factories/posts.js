var app = angular.module('myApp');

app.factory('posts', function($http){
  var factory = {};

  factory.getAllPosts = function(request){ //get the posts of all the users that that the current user is following
    return $http.post("/api/posts/getPosts", request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.getUserPosts = function(request){
    return $http.post("/api/profile/getUserPosts", request).then(function(response){
      this.response = response.data;
      return this.response;
    });
  }

  factory.getSinglePost = function(request){
    return $http.post("/api/posts/getPost",request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.submitPost = function(request){
    return $http.post("/api/posts/post", request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.submitComment = function(request){
    return $http.post("/api/posts/comment", request).then(function(response){
      if(response.data.status === 200){
        this.response.status = 200;
      }
      else{
        this.response = "Error!";
      }
      return this.response;
    })
  }
  factory.likePost = function(request){
    return $http.post("/api/posts/likePost", request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  factory.unlikePost = function(request){
    return $http.post("/api/posts/unlikePost", request).then(function(response){
      this.response = response.data;
      return this.response;
    })
  }

  return factory;
})
