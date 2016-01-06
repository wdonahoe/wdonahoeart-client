var login = angular.module('wdonahoeart.login', [
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
}]);