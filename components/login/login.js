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
.controller('LoginCtrl', ['$scope','$http','$state','apiFactory', function($scope, $http, $state, apiFactory){
	$scope.user = {};

	function handleRequest(res){
		var token = res.data.id_token;
		var user = res.data.user;
		if (token)
			$scope.$emit('gotAuthorization', {token: token, user: user});
		$state.go('home');
	}

	$scope.login = function($http){
		apiFactory.login($scope.user)
				.then(handleRequest,
				function(err){
				  	alert(err.data);
				});
	};
}]);