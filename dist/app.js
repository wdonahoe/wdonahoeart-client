

var app = angular.module('wdonahoeart', [
	'wdonahoeart.home',
	'wdonahoeart.login',
	'wdonahoeart.jwtAuth',
	'wdonahoeart.admin',
	'wdonahoeart.gallery',
	'wdonahoeart.text',
	'wdonahoeart.landing',
	'wdonahoeart.contact'
]);

app.constant('API_URL','http://localhost:8080/api')
// app.constant('API_URL','http://107.170.44.229/api')
.config(['$urlRouterProvider', '$httpProvider', function($urlRouterProvider, $httpProvider){
	
	/* note, you NEED this line for ui-router to work! */
	$urlRouterProvider.otherwise('/');
	
	$httpProvider.interceptors.push('jwtAuthInterceptor');

}])
.filter('trusted', ['$sce', function($sce){
	return function(url){
		return $sce.trustAsResourceUrl(url);
	};
}])
.run(['$rootScope', 'jwtAuthFactory', function($rootScope, jwtAuthFactory){

	$rootScope.$on('$stateChangeStart', function(e, to){
		if (to.data && to.data.requiresLogin){
			if (!jwtAuthFactory.isAuthed()){
				e.preventDefault();
				$state.go('login');
			}
		}
	});

}])
.factory('jwtAuthInterceptor', ['$q', '$injector', 'jwtAuthFactory', 'API_URL', function($q, $injector, jwtAuthFactory, API_URL){
	
	return {
		request: function(config){
			var token = jwtAuthFactory.getToken();
			if (config.url.indexOf(API_URL) === 0 && token){
				config.headers.authorization = 'Bearer ' + token;
			}
			return config;
		},
		response: function(res){
			if (res.config.url.indexOf(API_URL) === 0 && res.data.id_token){
				jwtAuthFactory.storeToken(res.data.id_token, res.data.user);
			}
			return res;
		},
		responseError: function(rejection){
			if (rejection.status === 401){
				$injector.get('$state').go('login');
				return $q.reject(rejection);
			}
			return $q.reject(rejection);
		}
	};

}])
.controller('AppCtrl', ['$scope', '$state', 'jwtAuthFactory', '$location', '$rootScope', function($scope, $state, jwtAuthFactory, $location, $rootScope){

	this.isAuthed = function(){
		return jwtAuthFactory.isAuthed();
	}

	this.logout = function(){
		jwtAuthFactory.destroyAuth();
		$state.go('home');
	}
	if ($location.url() == '' || $location.url() == '/'){
		$state.go('landing');
		$scope.landing = true;
	}

	$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState){
		if (fromState.name === 'landing'){
			$scope.transitioning = true;
		}
		else {
			$scope.transitioning = false;
		}
		if (toState.name === 'landing'){
			$scope.landing = true;
		} else {
			$scope.landing = false;
		}
	});

}]);;var admin = angular.module('wdonahoeart.admin',[
	'ngResource',
	'ui.router',
	'dndLists',
	'wdonahoeart.fileReader'
]);

function getImageUrls2(apiFactory){
	return apiFactory.getImageUrls();
}
getImageUrls2.$inject = ['apiFactory'];

function getDrawing(apiFactory, $stateParams){
	return apiFactory.getDrawing($stateParams.id);
}
getDrawing.$inject = ['apiFactory','$stateParams'];

admin.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: 'components/admin/admin.html',
			data: {
				requiresLogin: true
			}
		})
		.state('admin.upload', {
			url: '',
			templateUrl: 'components/admin/partials/admin.upload.html',
			controller: 'UploadCtrl',
		})
		.state('admin.edit', {
			url: '/edit',
			templateUrl: 'components/admin/partials/admin.edit.html',
			resolve: {
				drawings: getImageUrls2
			},
			controller: ['drawings', 'apiFactory', '$state', function(drawings, apiFactory, $state){
				this.drawings = drawings.data;
				this.orig = this.drawings;

				this.reorder = function(){
					var self = this;
					if (_.every(self.drawings, self.orig)){
						return false;
					} else { 
						apiFactory.reorderDrawings(self.drawings).then(function(res){
							if (!_.every(self.drawings.bw, self.orig.bw))
								$state.go('gallery.views', {gallery: 'shades-of-gray'});
							else
								$state.go('gallery.views', {gallery: 'color'});
						});
					}
				}
			}],
			controllerAs: 'ctrl'
		})
		.state('admin.edit-drawing', {
			url: '/edit/{id}',
			templateUrl: 'components/admin/partials/admin.edit-drawing.html',
			resolve: {
				drawing: getDrawing
			},
			controller: ['drawing','$scope','apiFactory', 'fileReaderFactory', '$timeout', '$state', function(drawing, $scope, apiFactory, fileReader, $timeout, $state){
				var self = this;
				self.drawing = drawing.data;
				self.imgSrc = self.drawing.url;

				var data_keys = ['title','medium','width','height','isBw'];
				self.allFilled = function() {
					var keys = _.keys(self.drawing)
					return !(_.isEmpty(_.difference(data_keys, keys)));
				}

				self.getFile = function(){
					fileReader.readAsDataURL($scope.file, $scope)
						.then(function(result){
							self.imgSrc = result;
						});
				}

				self.upload = function(){
					$scope.loading = true;

					apiFactory.editDrawing($scope.file, self.drawing)
						.then(function(result){		
							$timeout(function(){
								self.myForm.$setPristine();			

								var toGo = result.data.isBw ? "shades-of-gray" : "color";
								$state.go('gallery.views', {gallery: toGo});
							}, 500);
						}, function(error){
							console.log(error);
						}
					);
				}

			}],
			controllerAs: 'ctrl'
		});

}])
.directive('editList', function(){
	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			drawings: '='
		},
		templateUrl: 'components/admin/partials/admin.edit-list.html',
		controller: ['apiFactory', '$state', function(apiFactory, $state){	
		}],
		controllerAs: 'ctrl',
	}
});;admin.controller('UploadCtrl', ['apiFactory','fileReaderFactory','$scope', '$timeout', '$state', function(apiFactory, fileReaderFactory, $scope, $timeout, $state){
	var self = this;

	var data_keys = ['title','medium','width','height','isBw'];
	var imgUploaded = false;

	self.imgSrc;

	self.allFilled = function() {
		var keys = _.keys(self.data)
		return !(_.isEmpty(_.difference(data_keys, keys)) && $scope.file);
	}

	self.getFile = function(){
		fileReaderFactory.readAsDataURL($scope.file, $scope)
			.then(function(result){
				self.imgSrc = result;
			});
	}

	self.upload = function(){
		$scope.loading = true;

		apiFactory.uploadS3($scope.file, self.data)
			.then(function(result){
				
				$timeout(function(){

					self.myForm.$setPristine();
					self.data = {};
					imgUploaded = true;

					var toGo = result.data.isBw ? "shades-of-gray" : "color";

					$state.go('gallery.views', {gallery: toGo});
				}, 500);
				

			}, function(error){
				console.log(error);
			}
		);
	};

}]);;angular.module('wdonahoeart.api', [
])
.factory('apiFactory', ['$http', 'API_URL', function($http, API_URL){

	var apiFactory = {};

	apiFactory.login = function(user){

		return $http({
			method: 'POST',
			url: API_URL + '/login',
			data: user
		});
	};

	apiFactory.uploadS3 = function(file, fileData){
		return $http.post(API_URL + '/upload_s3',
			{
				file: file,
				fileData: fileData
			},
			{
				transformRequest: function(data){
					var formData = new FormData();

					formData.append("data", JSON.stringify(data.fileData));
					formData.append("file", data.file);

					return formData;
				},
				headers: {
					'Content-Type': undefined
				}
			}
		);
	};

	apiFactory.editDrawing = function(file, drawing){
		return $http.put(API_URL + '/drawing/' + drawing._id,
			{
				file: file ? file : undefined,
				drawing: _.omit(drawing, 'dimensions')
			},
			{
				transformRequest: function(data){
					var formData = new FormData();
					formData.append("drawing", JSON.stringify(data.drawing));
					formData.append("file", data.file);

					return formData;
				},
				headers: {
					'Content-Type': undefined
				}
			}
		);
	};

	apiFactory.reorderDrawings = function(drawings){

		return $http({
			method: 'POST',
			url: API_URL + '/drawings/reorder',
			data: {bw: drawings.bw, color: drawings.color}
		});
	}

	apiFactory.getImageUrls = function(gallery){
		if (gallery === undefined)
			var gallery = 'all';

		return $http({
			method: 'GET',
			url: API_URL + '/drawings/' + gallery,
			cached: true
		});
	};

	apiFactory.getDrawing = function(id){
		return $http({
			method: 'GET',
			url: API_URL + '/drawing/' + id
		});
	}

	return apiFactory;
}]);;angular.module('wdonahoeart.contact', [
	'ui.router'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('contact',{
		url: '/contact',
		templateUrl: 'components/contact/contact.html'
	});
}]);;angular.module('wdonahoeart.fileReader', [
])
.factory('fileReaderFactory', ['$q', '$log', function($q, $log){

	   var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);    
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };


	return {
        readAsDataURL: readAsDataURL
    };

}]);;var gallery = angular.module("wdonahoeart.gallery", [
	'ngResource',
	'ui.router'
]);

function getImageUrls(apiFactory, $stateParams){
	var param = $stateParams.gallery === 'color' ? 'color' : 'bw';
	return apiFactory.getImageUrls(param);
}
getImageUrls.$inject = ['apiFactory','$stateParams'];

gallery.config(['$stateProvider', function($stateProvider){
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
				drawings: getImageUrls
			}
		});
}])
.controller('SliderController', ['$scope', 'drawings', function($scope, drawings){
	$scope.drawings = drawings.data.gallery;
	$scope.loadedDrawings = [];
	$scope.loaded = false;

	$scope.changeImg = function(newDrawing){
		$scope.$parent.$broadcast('galleryImageSwitch', newDrawing);
	};

	$scope.changeInfo = function(hoverDrawing){
		$scope.$parent.$broadcast('sliderHover', hoverDrawing);
	};

}])
.controller('GalleryImgController', ['$scope', 'drawings', function($scope, drawings){
	$scope.currentDrawing = drawings.data.gallery[0];

	$scope.$on('galleryImageSwitch', function(event, drawing){
		$scope.currentDrawing = drawing;
	});

	$scope.$on('sliderHover', function(event, drawing){
		if ($scope.$parent !== event.targetScope)
			return;
		$scope.hoverDrawing = drawing;
	});

}])
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
.directive('galleryImg', ['$timeout', '$window', function($timeout, $window){
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
				$timeout(function(){element.removeClass("fadeIn")}, 450);
			});
		}
	}
}])
.directive('scrollPane', ['$timeout', '$window', function($timeout, $window){
	return {
		restrict: 'EA',
		transclude: true,
		replace: true,
		template: '<div class="scroll-pane slide-up"><div ng-transclude></div></div>',
		scope: {
			length: '@'
		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){
			$scope.loaded = false;
			$scope.numLoaded = 0;

			this.addLoadedDrawing = function(){
				$scope.numLoaded++;
				if ($scope.numLoaded == $scope.length){
					$scope.loaded = true;
					$scope.$apply();
				}
			}

		}],
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
					$timeout(function(){element.removeClass("hide-scroll")},100);
				}
			});
		}
	}
}])
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
});angular.module('wdonahoeart.home', [
	'ui.router'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'components/home/home.html',
		controller: 'HomeCtrl'
	});
}])
.controller('HomeCtrl', ['$scope', 'apiFactory', function($scope, apiFactory){
	$scope.messages = [];

	$scope.callUnprotected = function(){
		apiFactory.callUnprotected()
			.then(function(res){
				$scope.messages.splice(0, 0, res.data.message);
			}, function(err){
				$scope.messages.splice(0, 0, "There was an error with the server...");
			});
	}

	$scope.callProtected = function(){
		apiFactory.callProtected()
			.then(function(res){
				$scope.messages.splice(0, 0, res.data.message);
			}, function(err){
				$scope.messages.splice(0, 0, "You're not logged in!");
			});
	}
}]);;angular.module('wdonahoeart.jwtAuth', [
])
.factory('jwtAuthFactory', ['$window', function($window){
	var jwtAuthFactory = {};

	jwtAuthFactory.parseJwt = function(token){
		var base64Url = _.first(token.split('.'));
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse($window.atob(base64));
	}

	jwtAuthFactory.storeToken = function(token, user){
		$window.localStorage['jwtToken'] = token;
		$window.localStorage['user'] = user;
	}

	jwtAuthFactory.getToken = function(){
		return $window.localStorage['jwtToken'];
	}

	jwtAuthFactory.getUser = function(){
		return $window.localStorage['user'];
	}

	jwtAuthFactory.destroyAuth = function(){
		$window.localStorage.removeItem('jwtToken');
		$window.localStorage.removeItem('user');
	}

	jwtAuthFactory.isAuthed = function(){
		var token = this.getToken();
		var user = this.getUser();
		if (token && user){
			var params = this.parseJwt(token);
			return true;
		}
		else {
			return false;
		}
	}

	return jwtAuthFactory;
}]);;angular.module('wdonahoeart.landing', [
	'ui.router'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('landing', {
		url: '/',
		templateUrl: 'components/landing/landing.html',
		controller: 'LandingCtrl as ctrl'
	});
}])
.controller('LandingCtrl', ['$timeout', function($timeout){
	var self = this;
	var interval = 5000;
	var currentIndex = 0;
	var start = true;

	self.slides = [
		{src: 'https://s3.amazonaws.com/wdonahoeart/BostonGirl_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/APearofHands_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/Olivia_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/BagLunch_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/IslandFairy_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/DistantCousins_Landing.jpg', loaded: false}
	];

	self.setCurrentIndex = function(index){
		currentIndex = index;
	}

	self.isCurrentIndex = function(index){
		return currentIndex === index;
	}

	self.nextSlide = function(){
		if (start){
			start = false;
		} else {
			self.slides[currentIndex].loaded = false;
			currentIndex = (currentIndex < self.slides.length - 1) ? ++currentIndex : 0;
		}
		self.slides[currentIndex].loaded = true;
		$timeout(self.nextSlide, interval);
	}

	this.loadSlides = function(){
	    $timeout(self.nextSlide, 0);
	}

	self.loadSlides();
}]);;var login = angular.module('wdonahoeart.login', [
	'wdonahoeart.api',
	'ui.router'
]);
login.config(['$stateProvider', function($stateProvider){
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'components/login/login.html',
		controller: 'LoginCtrl'
	});
}])
.controller('LoginCtrl', ['$scope', '$http', '$state', 'apiFactory', function($scope, $http, $state, apiFactory){
	$scope.user = {};

	$scope.login = function($http){
		apiFactory.login($scope.user)
			.then(function(res){
				$state.go('home');
			},
			function(err){
				 	alert(err.data);
		});
	};
}]);;angular.module("wdonahoeart.text", [
	'ngResource',
	'ui.router'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('bio',{
			url: '/bio', 
			templateUrl: 'components/text/partials/bio.html'
		})
		.state('cv', {
			url: '/cv',
			templateUrl: 'components/text/partials/cv.html'
		});
}]);;app.directive('fadeIn', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			element.on('load', function(){
				element.addClass("fadeIn");
			});
		}
	};
});;app.directive('fadeOut', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					element.toggleClass("fadez");				
			});
		}
	};
});;app.directive('fileInput', ['$parse', function($parse){
	return {
		restrict: 'EA',
		template: '<input type="file" />',
		replace: true,
		link: function(scope, element, attrs){

			var modelGet = $parse(attrs.fileInput);
			var modelSet = modelGet.assign;
			var onChange = $parse(attrs.onChange);

			var updateModel = function(){
				scope.$apply(function(){
					modelSet(scope, element[0].files[0]);
					onChange(scope);
				});
			};

			element.bind('change', updateModel);
		}
	};
}]);;app.directive('myLoginForm', function(){
	return {
		restrict: 'E',
		scope: { 
			name: '@',
			type: '@',
			field: '='
		},
		controller: 'LoginCtrl',
		templateUrl: 'shared/templates/myLoginForm.html',
		link: function(scope, element, attrs){
			element.find("label").text(_.capitalize(attrs.name));
		}
	};
});;app.directive('spinner', function(){
	return {
		restrict: 'E',
		replace: true,
		template: '<span class="spinner"><img class="img-responsive center-block" src="static/loading-spinning-bubbles.svg" /></span>',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					$(element).show();
				else
					$(element).hide();
			});
		}
	};
});