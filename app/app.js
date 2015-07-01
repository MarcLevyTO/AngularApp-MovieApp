//= require_self
//= require_tree ./services
//= require_tree ./directives
//= require_tree ./resources

// Define resources
angular.module('myApp.resources', []);

// Define services that use the resources
angular.module('myApp.services', ['myApp.resources']);

// Define directives that use the resources and services
angular.module('myApp.directives', ['myApp.services', 'myApp.resources']);

// Define the angular application that uses the resources, services, and directives
var app = angular.module('myApp', ['myApp.resources', 'myApp.services', 'myApp.directives']);

// Define the controller
app.controller('myController', ['$scope', '$http', function($scope, $http) {

  // Scope Variables
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.movies = [];
  $scope.sortBy = 'Title';

  // Scope Functions
  $scope.numberOfPages = function(){
    return Math.ceil($scope.movies.length/$scope.pageSize);
  }

  // Load data from feed json file
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
}]);

app.filter('startFrom', function() {
  return function(input, start) {
      start = +start;
      return input.slice(start);
  }
});

// Define a image viewer directive
var imageViewerCtrl = function($scope) {};
imageViewerCtrl.$inject = ['$scope'];

var imageViewer = function() {
  var directive = {};

  directive.restrict = 'E';
  directive.scope = { movieImage: '=' };
  directive.templateUrl = '/app/templates/image_viewer.html';
  directive.controller = imageViewerCtrl;

  return directive;
};

app.directive('imageviewer', imageViewer);