angular.module("wdonahoeart.gallery", [
	'ngResource',
	'ngTouch',
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider
		.state('gallery',{
			abstract: true, 
			templateUrl: 'components/gallery/gallery.html'
		})
		.state('gallery.views', {
			url: "/{gallery:shades-of-gray|color}",
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
					var param = $stateParams.gallery === 'color' ? 'color' : 'bw';
					return apiFactory.getImageUrls($stateParams.param)
						.then(function(result){
							return _.get(result.data, param);
					});
				}
			}
		});
})
.controller('SliderController', function($scope, drawings){
	$scope.drawings = drawings;
	$scope.loadedDrawings = [];
	$scope.loaded = false;

	$scope.changeImg = function(newDrawing){
		$scope.$parent.$broadcast('galleryImageSwitch', newDrawing);
	};

	$scope.changeInfo = function(hoverDrawing){
		$scope.$parent.$broadcast('sliderHover', hoverDrawing);
	};

})
.controller('GalleryImgController', function($scope, drawings){
	$scope.index = 0;
	$scope.currentDrawing = drawings[$scope.index];

	$scope.$on('galleryImageSwitch', function(event, drawing){
		if (drawing.index === undefined){
			$scope.currentDrawing = drawing;
			$scope.index = _.findIndex(drawings, {'_id': drawing._id });
		}
		else {
			if (drawing.index > drawings.length){
				drawing.index = 0;
			}
			$scope.$apply(function(){
				$scope.currentDrawing = drawings[drawing.index];
				$scope.index = drawing.index;
			});
		}
	});

	$scope.$on('sliderHover', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.hoverDrawing = drawing;
	});

})
.directive('hoverInfo', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			drawing: '='
		},
		template: '<div class="img-info" ng-cloak>' +
				  '    <b>{{drawing.title}}</b>  &nbsp&nbsp {{drawing.dimensions}} &nbsp&nbsp{{drawing.medium}}' +
				  '</div>'
	};
})
.directive('galleryImg', function($timeout, $swipe, $window){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			drawing: "=",
			index: "=",
			filter: "="
		},
		template: '<img ng-src="{{drawing.url | filter}}" alt="{{drawing.title}}" ng-class="tallOrWide()">',
		controller: function($scope){
			
			$scope.tallOrWide = function(){
				var tall =  Number($scope.drawing.height) > Number($scope.drawing.width);
				return {tall: tall, wide: !tall};
			}

		},
		link: function(scope, element, attrs){
			var startX;
			var deltaX;
			var w = angular.element($window);
			var opacity;
			var abs;

			scope.$watch(function(){
				return w.width();
			}, function(newWidth, oldWidth){
				if (newWidth <= 991){
					$swipe.bind(element, {
						'start': function(coords){
							startX = coords.x;
						},
						'move': function(coords){
							deltaX = coords.x - startX;
							console.log(deltaX);
							element.css({
								'transform': 'translateX('+deltaX+'px)',
								'opacity': -0.005 * Math.abs(deltaX) + 1
							});
						},
						'end': function(coords){
							if (deltaX < 0 && Math.abs(deltaX) >= 100){
								scope.$emit('galleryImageSwitch', {drawing: undefined, index: scope.index + 1});
							} else if (deltaX > 100){
								scope.$emit('galleryImageSwitch', {drawing: undefined, index: scope.index > 0 ? scope.index - 1 : 0});
							}
							element.css({
								'transform': 'translateX(0px)',
								'opacity': 1
							});
							return;
						}
					});
				} else {
					element.unbind('mousedown mousemove mouseup touchstart touchmove touchend touchcancel');				
				}
			}, true);

			w.bind('resize', function(){
				scope.$apply();
			})

			scope.$watch('drawing', function(newVal, oldVal){
				if (newVal === oldVal) 
					return;
				element.addClass("fadeIn");
				$timeout(function(){element.removeClass("fadeIn")}, 450);
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
		scope: {
			length: '@'
		},
		controller: function($scope, $element, $attrs){
			$scope.loaded = false;
			$scope.numLoaded = 0;

			this.addLoadedDrawing = function(){
				$scope.numLoaded++;
				if ($scope.numLoaded == $scope.length){
					$scope.loaded = true;
					$scope.$apply();
				}
			}

		},
		link: function(scope, element, attrs){
			scope.$watch('loaded', function(val){
				if (val){
					element.jScrollPane({animateScroll:true, autoreinitialize:true});
				}
			});
		}
	}
})
.directive('imageonload', function(){
	return {
		restrict: 'A',
		require: '^scrollPane',
		link: function(scope, element, attrs, scrollPaneCtrl){
			element.bind('load', function(){
				scrollPaneCtrl.addLoadedDrawing();
			});
		}
	}
})