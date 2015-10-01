angular.module("wdonahoeart.gallery", [
	'ngResource',
	'angular-wurfl-image-tailor',
	'ui.router',
	'slick'
])
.config(function($stateProvider){
	$stateProvider
		.state('gallery',{
			abstract: true,
			templateUrl: 'components/gallery/gallery.html'
		})
		.state('gallery.views', {
			url: '/{gallery}',
			views: {
				'left@gallery': {
					templateUrl: 'components/gallery/partials/gallery-slick.html',
					controller: 'SliderController'
				},
				'right@gallery': {
					templateUrl: 'components/gallery/partials/gallery-img.html',
					controller: 'GalleryImgController'
				}
			},
			resolve: {
				apiFactory: 'apiFactory',
				drawings: function(apiFactory, $stateParams){
					var galleryType = $stateParams.gallery == 'color' ? false : true;
					return apiFactory.getImageUrls(galleryType);
				}
			}
		});
})
.controller('SliderController', function($scope, drawings){
	$scope.drawings = drawings.data;
})
.controller('GalleryImgController', function($scope, drawings){
	$scope.currentDrawing = drawings.data[0];
});