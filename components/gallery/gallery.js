angular.module("wdonahoeart.gallery", [
	'ngResource',
	'angular-wurfl-image-tailor',
	'ui.router'
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
	$scope.loaded = true;

	$scope.changeImg = function(newDrawing){
		$scope.$parent.$broadcast('galleryImageSwitch', newDrawing);
	};

})
.directive('scrollPane',function($timeout){
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		template: '<div class="scroll-pane"><div ng-transclude></div></div>',
		link: function(scope, element, attrs){
			scope.$watch('loaded', function(val){
				if (val){
					$timeout(function(){
						element.jScrollPane({ autoReinitialize:true });
					}, 0);
				}
			});
		}
	}
})
.controller('GalleryImgController', function($scope, drawings){
	$scope.currentDrawing = drawings.data[0];

	$scope.$on('galleryImageSwitch', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.currentDrawing = drawing;
	});
});