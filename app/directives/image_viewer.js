(function(){
'use strict';

var imageViewerCtrl = function($scope) {
};

imageViewerCtrl.$inject = ['$scope'];

var imageViewer = function() {
  var directive = {};

  directive.restrict = 'E';
  directive.scope = { movieImage: '=' };
  directive.templateUrl = '/app/templates/image_viewer.html';
  directive.controller = imageViewerCtrl;

  return directive;
};

angular.module('myApp.directives')
       .directive('imageViewer', imageViewer);

}());
