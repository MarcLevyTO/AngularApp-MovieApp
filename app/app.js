var app = angular.module('myApp', []);

app.controller('myController', ['$scope', '$http', function($scope, $http) {

  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.movies = [];
  $scope.sortBy = 'Title';
  $scope.numPages = function(){
    return Math.ceil($scope.movies.length/$scope.pageSize);
  }

  $http.get('assets/feed.json')
       .then(function(res){

          //Data Transforms
          for (i = 0; i < res.data.Data.length; i++) {
            var datum = res.data.Data[i];

            // Move Title, ReleaseYear, and Duration up one level
            datum.Title = datum.Item.Title;
            datum.ReleaseYear = datum.Item.ReleaseYear;
            datum.RunTimeSec = datum.Item.RunTimeSec;

            //Extract out the main image from the other ones
            var images = datum.Item.Images;
            for(j = 0; j < images.length; j++) {
              if (images[j].Type == 1) {
                datum.mainImage = images[j].ImageId;
              }
            }
          }

          // Add movies to scope
          $scope.movies = res.data.Data;
        });

  var audio = document.createElement('audio');
  $scope.audio = audio;
  audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
  audio.play();

}]);

app.filter('startFrom', function() {
  return function(input, start) {
      start = +start;
      return input.slice(start);
  }
});