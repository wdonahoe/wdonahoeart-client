angular.module('wdonahoeart.contact', [
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider.state('contact',{
		url: '/contact',
		templateUrl: 'components/contact/contact.html'
	});
});