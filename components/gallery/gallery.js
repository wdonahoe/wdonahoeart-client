angular.module("wdonahoeart.gallery", [
	'ngResource',
	'angular-wurfl-image-tailor',
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider
		.state('gallery', {
			abstract: true,
			url: '/gallery',
			templateUrl: 'components/gallery/gallery.html',
			controller: 'GalleryCtrl'
		})
		.state('gallery.shades-of-gray', {
			url: '/shades-of-gray',
			templateUrl: 'components/gallery/partials/gallery.shades-of-gray.html',
			controller: function($scope, drawings){
				$scope.drawings = drawings.data;
			},
			resolve: {
				apiFactory: 'apiFactory',
				drawings: function(apiFactory){
					return apiFactory.getImageUrls(true);
				}
			}
		})
		.state('gallery.color', {
			url: '/color',
			templateUrl: 'components/gallery/partials/gallery.shades-of-gray.html',
			controller: function($scope, drawings){
				$scope.drawings = drawings.data;
			},
			resolve: {
				apiFactory: 'apiFactory',
				drawings: function(apiFactory){
					return apiFactory.getImageUrls(false);
				}
			}
		});
})
.controller('GalleryCtrl', function($scope){

});