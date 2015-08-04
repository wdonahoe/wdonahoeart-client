angular.module('wdonahoeart', [
	'wdonahoeart.home',
	'wdonahoeart.login',
	'wdonahoeart.jwtAuth'
])
.config(function($urlRouterProvider, $httpProvider){
	
	/* note, you NEED this line for ui-router to work! */
	$urlRouterProvider.otherwise('/');

	var SERVER = 'http://localhost:8080/api'
	$httpProvider.interceptors.push(['$q', '$injector', 'jwtAuthFactory', function($q, $injector, jwtAuthFactory){
		return {
			request: function(config){
				var token = jwtAuthFactory.getToken();
				if (config.url.indexOf(SERVER) === 0 && token){
					console.log("Making request to api...");
					config.headers.authorization = 'Bearer ' + token;
				}
				return config;
			},
			response: function(res){
				if (res.config.url.indexOf(SERVER) === 0 && res.data.id_token){
					console.log("storing token: " + res.data.id_token);
					jwtAuthFactory.storeToken(res.data.id_token, res.data.user);
				}
				return res;
			},
			responseError: function(rejection){
				if (rejection.status === 401){
					console.log("Response Error 401:", rejection);
					$injector.get('$state').go('login');
					return $q.reject(rejection);
				}
				return $q.reject(rejection);
			}
		};
	}]);
})
.controller('AppCtrl', ['$scope', '$state', 'jwtAuthFactory', function($scope, $state, jwtAuthFactory){

	this.isAuthed = function(){
		return jwtAuthFactory.isAuthed();
	}

	this.logout = function(){
		jwtAuthFactory.destroyAuth();
		$state.go('home');
	}

}]);