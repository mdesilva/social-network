angular.module('myApp').controller('postController', ['$rootScope','$scope','posts','$state','$interval', '$stateParams', function($rootScope,$scope,posts,$state,$interval, $stateParams){

  //when commenting, liking, or unliking a post, we wil send a request to update the data on the server side, but we will simulate the
  //updated data here on the client side so we don't have to reload the entire state to reflect the changes.
  //When the state or page is refreshed again , it will get the latest data directly from the server, including our changes.

  var state = $state.current.name;
  $scope.posts = []; //initialize the posts, which will be stored in an array after retrieving them from the database

  var refreshAllPosts = function(){
    posts.getAllPosts($scope.request).then(function(response){
      if(response.length > $scope.posts.length){
        $scope.newPostsAlert = "There are " + (response.length - $scope.posts.length) + " new posts.";
      }
    })
  }

  var getAllPosts = function(){
    return posts.getAllPosts($scope.request).then(function(response){
      $scope.posts = response;
    });
  }

  if(state === "main"){
    getAllPosts();
    $interval(refreshAllPosts, 5000);
  }
  if(state === "viewPost"){
    var requestToGetSinglePost = {
      currentUser: $scope.currentUser,
      postId: $stateParams.postId
    }
    posts.getSinglePost(requestToGetSinglePost).then(function(response){
      $scope.posts = response;
    })
  }
  else{
    posts.getUserPosts($scope.request).then(function(response){
      $scope.posts = response;
    })
  }


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
