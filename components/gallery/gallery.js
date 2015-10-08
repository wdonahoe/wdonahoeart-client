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
.controller('GalleryImgController', function($scope, drawings){
	$scope.currentDrawing = drawings.data[0];

	$scope.$on('galleryImageSwitch', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.currentDrawing = drawing;
	});
})
.directive('galleryImg', function($timeout){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			drawing: "=",
			filter: "="
		},
		template: '<img ng-src="{{drawing.url | filter}}" alt="{{drawing.title}}">',
		link: function(scope, element, attrs){
			if (scope.drawing.width > scope.drawing.height){
				element.addClass("wide");
			} else {
				element.addClass("tall");
			}
		}
	}
})
.directive('scrollPane',function($timeout){
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		template: '<div class="scroll-pane"><div ng-transclude></div></div>',
		link: function(scope, element, attrs){
			var reinitialize = function(){
				element.jScrollPane();
				return scope.pane = element.data('jsp');
			}
			$timeout(reinitialize, 0);
			scope.$watch('loaded', function(val){
				if (val){
					$timeout(reinitialize, 0);
				}
			});
		}
	}
});