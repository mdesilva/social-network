angular.module('myApp').controller("searchController", ['$scope', '$state', function($scope, $state){

  var results = $state.params.results; //access the additional paramaters passed from one state to another. Must define these params in recieving state
  //console.log("Navigated to the search page");
  if(results.message === "No results"){
    $scope.error = "No results were found"
  }
  else{
    $scope.results = results;
  }

}])
