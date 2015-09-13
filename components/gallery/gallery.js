angular.module("wdonahoeart.gallery", [

])
.config(function($stateProvider){
	$stateProvider
		.state('gallery', {
			abstract: true,
			url: '/gallery',
			templateUrl: 'components/gallery/gallery.html',
			controller: 'GalleryCtrl'
		})
		.state('gallery.shadesOfGray', {
			url: 'shades-of-gray',
			templateUrl: 'components/gallery/gallery.html',
			resolve: {
				getDrawingUrls: function(apiFactory){
					return apiFactory.getImageUrls(true);
				};
			}
		});
});