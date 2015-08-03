angular.module('wdonahoeart.api', [

])
.factory('apiFactory', ['$http', function($http){

	var url = 'http://localhost:8080/api';
	var apiFactory = {};

	apiFactory.login = function(user){
		return $http.post({
			url: url + '/login',
			data: user
		});
	};

	/* more functions */

	return apiFactory;
}]);