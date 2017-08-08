angular.module('myApp').controller('submitPost', ['$scope','posts', '$state', function($scope,posts, $state){

  $scope.submitPost = function(){
      var request = {
        username: $scope.request.currentUser,
        content: $scope.newPost
      }
      posts.submitPost(request).then(function(response){
        $state.reload();
      })
    };
}])
