var app = angular.module('wdonahoeart', [
	'wdonahoeart.home',
	'wdonahoeart.login',
	'wdonahoeart.jwtAuth',
	'wdonahoeart.admin',
	'wdonahoeart.gallery'
]);

app.constant('API_URL','http://localhost:8080/api')
.config(function($urlRouterProvider, $httpProvider){
	
	/* note, you NEED this line for ui-router to work! */
	$urlRouterProvider.otherwise('/');
	
	$httpProvider.interceptors.push('jwtAuthInterceptor');


})
.filter('trusted', function($sce){
	return function(url){
		return $sce.trustAsResourceUrl(url);
	};
})
.run(function($rootScope, $state, jwtAuthFactory){

	$rootScope.$on('$stateChangeStart', function(e, to){
		if (to.data && to.data.requiresLogin){
			if (!jwtAuthFactory.isAuthed()){
				e.preventDefault();
				$state.go('login');
			}
		}
	});

})
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
.controller('AppCtrl', ['$scope', '$state', 'jwtAuthFactory', function($scope, $state, jwtAuthFactory){

	this.isAuthed = function(){
		return jwtAuthFactory.isAuthed();
	}

	this.logout = function(){
		jwtAuthFactory.destroyAuth();
		$state.go('home');
	}

}]);