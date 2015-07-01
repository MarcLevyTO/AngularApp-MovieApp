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
                else
                {
                  datum.secondaryImage = 'assets/Shomi_logo.jpg'
                }
              }
            }
          }

          // Add movies to scope
          $scope.movies = res.data.Data;
        });

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
    $scope.toggleImage = function(){
      $scope.isInImage = !$scope.isInImage;
    };
  };
  imageViewerCtrl.$inject = ['$scope'];

  var directive = {};
  directive.restrict = 'E';
  directive.scope = { movie: '=' };
  directive.templateUrl = '/app/templates/image_viewer.html';
  directive.controller = imageViewerCtrl;

  return directive;
});

app.directive('theDirective', function() {

  return {
    restrict: 'A',
    scope: { position: '@', last: '@', movie: '=' },
    link: function(scope, element, attrs) {

      element.bind('click', function() {

        // Highlight clicked element
        angular.element(document.querySelector('.clicked')).removeClass('clicked');
        element.addClass('clicked');

        // Create the collapse element or select existing one
        var collapseQuery = document.querySelector('#collapse');
        var collapse = collapseQuery === null ?
          angular.element('<div id="collapse" class="col-xs-12"><div class="twelve">{{scope.movie.Title}}</div></div>') :
          angular.element(collapseQuery);

        // Based on the position of the clicked element calculate the rounded number up to the nearest multiple of four
        var calculatedPosition = Math.ceil(scope.position / 5) * 5;

        // Get the element at the calculated position or the last one
        var calculatedQuery = document.querySelector('[position="' + calculatedPosition + '"]');
        if (calculatedQuery === null) calculatedQuery = document.querySelector('[last="true"]');;

        var calculatedElement = angular.element(calculatedQuery);

        // Insert the collapse element after the element at the calculated position
        calculatedElement.parent().after(collapse);
      });

      scope.$on('$destroy', function() {
        element.unbind('click');
      });
    }
  };
});

