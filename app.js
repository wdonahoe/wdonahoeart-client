angular.module('wdonahoeart', [
	'wdonahoeart.home',
	'wdonahoeart.login',
	'wdonahoeart.jwtAuth'
])
.config(function($urlRouterProvider){
	/* note, you NEED this line for ui-router to work! */
	$urlRouterProvider.otherwise('/');
})
.controller('AppCtrl', ['$scope', 'jwtAuthFactory', function($scope, jwtAuthFactory){

	$scope.$on('gotAuthorization', function(event, data){
		jwtAuthFactory.storeToken(data.token, data.user);
	});

}]);