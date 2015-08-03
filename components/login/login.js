angular.module('wdonahoeart.login', [
	'wdonahoeart.api',
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider.state('login',{
		url: '/login',
		templateUrl: 'components/login/login.html',
		controller: 'LoginCtrl'
	});
})
.controller('LoginCtrl', ['apiFactory', function($scope, $http, apiFactory){
	$scope.user = {};

	function handleRequest(res){
		var token = res.data ? res.data.token : null;
		if (token)
			$scope.$emit('gotToken', {token: token});
	}

	$scope.login = function($http){
		apiFactory.login($scope.user)
				  .then(handleRequest, handleRequest);
	};
}]);