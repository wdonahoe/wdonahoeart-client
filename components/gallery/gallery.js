angular.module("wdonahoeart.gallery", [
	'ngResource',
	'ngAnimate',
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

	$scope.changeInfo = function(hoverDrawing){
		$scope.$parent.$broadcast('sliderHover', hoverDrawing);
	};

})
.controller('GalleryImgController', function($scope, drawings){
	$scope.currentDrawing = drawings.data[0];
	$scope.hoverDrawing = null;

	$scope.$on('galleryImageSwitch', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.currentDrawing = drawing;
	});

	$scope.$on('sliderHover', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.hoverDrawing = drawing;
		console.log($scope.hoverDrawing);
	});

})
.directive('hoverInfo', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			drawing: '='
		},
		template: '<div class="img-info">' +
					'<strong>{{title}}</strong>  &nbsp&nbsp {{dimensions}} &nbsp&nbsp{{medium}}' +
				 '</div>',
		controller: ['$scope', function($scope){
			$scope.watch('drawing', function(){
				$scope.title = $scope.drawing === null ? '' : $scope.drawing.title;
				$scope.height = $scope.drawing === null ? '' : $scope.drawing.height;
				$scope.width = $scope.drawing === null ? '' : $scope.drawing.width;
				$scope.medium = $scope.drawing === null ? '' : $scope.drawing.medium;

				$scope.dimensions = $scope.height === null || $scope.width === null ? $scope.height + '\" x ' + $scope.width + '\"' : '';
			})
		}]
	};
})
.directive('galleryImg', function($timeout){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			drawing: "=",
			filter: "="
		},
		template: '<img ng-src="{{drawing.url | filter}}" alt="{{drawing.title}}" ng-class="tallOrWide()">',
		controller: ['$scope', function($scope){
			$scope.tallOrWide = function(){
				var tall =  Number($scope.drawing.height) > Number($scope.drawing.width);
				return {tall: tall, wide: !tall};
			}
		}],
		link: function(scope, element, attrs){
			scope.$watch('drawing', function(newVal, oldVal){
				if (newVal === oldVal) 
					return;
				element.addClass("fadeIn");
				$timeout(function(){element.removeClass("fadeIn")}, 350);
			});
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