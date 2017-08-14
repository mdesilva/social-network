angular.module('myApp').controller('postController', ['$rootScope','$scope','posts','$state','$interval', '$stateParams', function($rootScope,$scope,posts,$state,$interval, $stateParams){
  $scope.posts = []; //initialize the posts, which will be stored in an array after retrieving them from the database

  var state = $state.current.name;
  var refreshPosts;
  var currentUser;

  $scope.request = {
    username: $rootScope.user.username,
    currentUser: $rootScope.user.username,
  };

  var getAllPosts = function(){
    posts.getAllPosts($scope.request).then(function(response){
      $scope.posts = response;
    });
  }

  if(state === "main"){ //feed, get all posts of the users that the user follows
    getAllPosts();
    refreshPosts = $interval(getAllPosts, 5000);
  }
  if(state === "viewPost"){ //get one single post
    var requestToGetSinglePost = {
      currentUser: $rootScope.user.username,
      postId: $stateParams.postId
    }
    posts.getSinglePost(requestToGetSinglePost).then(function(response){
      $scope.posts = response;
    })
  }
  if(state === "viewProfile"){
    $scope.request = {
      username: $scope.userTwo, //we want to get the details and posts of the user profile that is being viewed
      currentUser: $scope.userOne //if we are commenting on a post, we are commenting as the user that is logged in
    }
    posts.getUserPosts($scope.request).then(function(response){
      $scope.posts = response;
    })
  }
  else{ //get just the users posts
    posts.getUserPosts($scope.request).then(function(response){
      $scope.posts = response;
    })
  }

  var stopPostsRefresh = function(){
    $interval.cancel(refreshPosts);
    refreshPosts = undefined;
  }

  $scope.$on('stop_posts_refresh', stopPostsRefresh);

  $scope.clickToComment = function(index){
    $scope.posts[index].commentEditor = true;
    $scope.posts[index].newComment = true;
  }

  $scope.cancelComment = function(index){
    $scope.comment = "";
    $scope.posts[index].newComment = false;
    $scope.posts[index].commentEditor = false;
  }

  $scope.submitComment = function(postId,index) {
    var requestToComment = {
      currentUser: $scope.request.currentUser,
      postId: postId,
      comment: $scope.comment
    }

    var requestToUpdatePost = {
      currentUser: $scope.request.currentUser,
      postId: postId
    }

    posts.submitComment(requestToComment).then(function(response){ //post the comment to the server
      posts.getSinglePost(requestToUpdatePost).then(function(response){
        var response = response[0];
        $scope.comment = ""; //clear the comment textarea after submit
        $scope.posts[index].newComment = false; //clear the newComment model
        $scope.posts[index].commentEditor = false; //hide the comment editor
        $scope.posts[index].comments = response.comments; //reload the comments
      })

      })
    }

  $scope.likePost = function(postId,index){
    var request = {
      currentUser: $scope.request.currentUser,
      postId: postId
    }
    posts.likePost(request).then(function(response){
      posts.getSinglePost(request).then(function(response){
        var response = response[0];
        $scope.posts[index].userLiked = response.userLiked;
        $scope.posts[index].likes = response.likes; //reload the number of likes
      })
    })
  }

  $scope.unlikePost = function(postId,index){
    var request = {
      currentUser: $scope.request.currentUser,
      postId: postId
    }
    posts.unlikePost(request).then(function(response){
      posts.getSinglePost(request).then(function(response){
        var response = response[0];
        $scope.posts[index].userLiked = response.userLiked;
        $scope.posts[index].likes = response.likes;
      })
    })
  }

  $scope.refreshState = function(){
    $state.reload();
  }
}])
