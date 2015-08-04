angular.module('wdonahoeart.api', [

])
.factory('apiFactory', function($http){

	var url = 'http://localhost:8080/api';
	var apiFactory = {};

	apiFactory.login = function(user){

		return $http({
			method: 'POST',
			url: url + '/login',
			data: user
		});
	};

	/* more functions */

	apiFactory.callUnprotected = function(){

		return $http({
			method: 'GET',
			url: url + '/test'
		});
	}

	apiFactory.callProtected = function(){

		return $http({
			method: 'GET',
			url: url + '/test/protect'
		});
	}

	return apiFactory;
});