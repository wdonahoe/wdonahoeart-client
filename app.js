angular.module('wdonahoeart', [
	'wdonahoeart.home',
	'wdonahoeart.login',
	'wdonahoeart.jwtAuth'
])
.config(function($urlRouterProvider){
	/* note, you NEED this line for ui-router to work! */
	$urlRouterProvider.otherwise('/');
})
.controller('AppCtrl', ['jwtAuthService', function($scope, jwtAuthService){

	$scope.$on('gotToken', function(event, token){
		jwtAuthService.storeToken(token);
	});

}]);