angular.module('wdonahoeart.home', [
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'components/home/home.html',
		controller: 'HomeCtrl'
	});
})
.controller('HomeCtrl', ['apiFactory', function($scope, apiFactory){
	$scope.message = "";

	$scope.callUnprotected = function(){
		apiFactory.callUnprotected()
			.then(function(res){
				$scope.message = res.data.message;
			}, function(err){
				$scope.message = "There was an error with the server...";
			});
	}

	$scope.callProtected = function(){
		apiFactory.callProtected()
			.then(function(res){
				$scope.message = res.data.message;
			}, function(err){
				$scope.message = "You're not logged in!";
			});
	}
}]);