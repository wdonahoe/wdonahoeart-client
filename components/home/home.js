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
.controller('HomeCtrl', function($scope){
	
});