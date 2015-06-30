var app = angular.module('myApp', []);

app.controller('myController', ['$scope', '$http', function($scope, $http) {

  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.movies = [];
  $scope.numPages = function(){
    return Math.ceil($scope.data.length/$scope.pageSize);
  }

  var audio = document.createElement('audio');
  $scope.audio = audio;

  $http.get('assets/feed.json')
       .then(function(res){
          $scope.movies = res.data.Data;
        });

  audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
  audio.play();
}]);

app.filter('startFrom', function() {
  return function(input, start) {
      start = +start;
      return input.slice(start);
  }
});