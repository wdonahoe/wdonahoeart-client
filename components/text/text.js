angular.module("wdonahoeart.text", [
	'ngResource',
	'ui.router'
])
.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('bio',{
			url: '/bio', 
			templateUrl: 'components/text/partials/bio.html'
		})
		.state('cv', {
			url: '/cv',
			templateUrl: 'components/text/partials/cv.html'
		});
}]);