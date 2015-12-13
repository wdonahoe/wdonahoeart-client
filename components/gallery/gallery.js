angular.module("wdonahoeart.gallery", [
	'ngResource',
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
					controllerProvider: function($stateParams){
						console.log($stateParams);
						return 'GalleryImgController';
					}
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

	// $scope.$on('smallScreen', function(event){
	// 	event.stopPropagation();
	// 	$scope.smallScreen = true;
	// 	console.log($scope.smallScreen);
	// });

	// $scope.$on('largeScreen', function(event){
	// 	event.stopPropagation();
	// 	$scope.smallScreen = false;
	// 	console.log($scope.smallScreen);
	// });

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
.directive('galleryImg', function($timeout, $window){
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
			scope.$watch('drawing', function(newVal, oldVal){
				if (newVal === oldVal) 
					return;
				element.addClass("fadeIn");
				$timeout(function(){element.removeClass("fadeIn")}, 450);
			});
		}
	}
})
.directive('scrollPane',function($timeout, $window){
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
			var w = angular.element($window);
			var switchFormat = false;
			var singlePane = false;

			scope.$watch(function(){
				return w.width();
			}, function(newWidth, oldWidth){
				if (newWidth <= 1200 && oldWidth > 1200){
					singlePane = true;
					switchFormat = true;
				} else if (newWidth > 1200 && oldWidth <= 1200){
					singlePane = false;
					switchFormat = true;
				} else {
					switchFormat = false;
				}
			});
			w.bind('resize', function(){
				scope.$apply(function(){
					if (switchFormat && singlePane){
						scope.pane.destroy();
					} else if (switchFormat && !singlePane){
						element.jScrollPane({animateScroll:true, autoreinitialize:true});
						scope.pane = element.data("jsp");
					}
				});
			});


			scope.$watch('loaded', function(val){
				if (val && w.width() > 1200){
					element.jScrollPane({animateScroll:true, autoreinitialize:true});
					scope.pane = element.data("jsp");
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