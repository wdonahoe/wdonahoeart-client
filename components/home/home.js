angular.module('wdonahoeart.home', [
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
}]);