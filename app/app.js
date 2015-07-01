// Function to extend and transform the string from seconds to hours and minutes
String.prototype.toHHMM = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    if (minutes < 10) {minutes = "0"+minutes;}
    var time = hours+'h '+ minutes + 'm';
    return time;
}

// Define the angular application
var app = angular.module('myApp', []);

// Service to load and transform the movie data
app.factory('MovieService', [ '$http', function($http){
   var userService = {};
    userService.getMovies = function() {
      return $http.get('assets/feed.json').then(function(res) {
        //Data Transforms
        for (i = 0; i < res.data.Data.length; i++) {
          var datum = res.data.Data[i];

          // Move Title, ReleaseYear, and Duration up one level
          datum.Title = datum.Item.Title;
          datum.ReleaseYear = datum.Item.ReleaseYear;
          datum.RunTimeSec = datum.Item.RunTimeSec;
          if (typeof datum.RunTimeSec != 'undefined') {
            datum.RunTimeString = datum.RunTimeSec.toString().toHHMM();
          }

          //Extract out the main image from the other ones
          var images = datum.Item.Images;
          for(j = 0; j < images.length; j++) {
            if (images[j].Type == 1) {
              datum.mainImage = images[j].ImageId;
            }
            if (images[j].Type == 2) {
              if (images[j].ImageId.includes('http')) {
                datum.secondaryImage = images[j].ImageId;
              }
              else {
                datum.secondaryImage = 'assets/Shomi_logo.jpg'
              }
            }
          }
        }
        return res.data;
      });
    };
    return userService;

}]);

// Define the controller
app.controller('myController', ['$scope', '$http', 'MovieService', function($scope, $http, MovieService) {

  // Scope Variables
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.movies = [];
  $scope.sortBy = 'Title';

  // Load in movies from service
  MovieService.getMovies().then(function(data){
      $scope.movies = data.Data;
  });

  // Scope Functions
  $scope.numberOfPages = function(){
    return Math.ceil($scope.movies.length/$scope.pageSize);
  }

}]);

// Define a filter for pagination
app.filter('startFrom', function() {
  return function(input, start) {
      start = +start;
      return input.slice(start);
  }
});

// Define a image viewer directive
app.directive('imageViewer', function(){
  var imageViewerCtrl = function($scope) {
    $scope.showMovieDetails = function(){
      if(!$scope.isInImage) {
        $scope.isInImage = true;
      }
    }
    $scope.showMoviePoster = function(){
      if($scope.isInImage) {
        $scope.isInImage = false;
      }
    }
  };
  imageViewerCtrl.$inject = ['$scope'];
  var directive = {};
  directive.restrict = 'E';
  directive.scope = { movie: '=' };
  directive.templateUrl = '/app/templates/image_viewer.html';
  directive.controller = imageViewerCtrl;
  return directive;
});