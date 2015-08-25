angular.module('wdonahoeart.api', [
])
.factory('apiFactory', ['$http', 'API_URL', function($http, API_URL){

	var apiFactory = {};

	apiFactory.login = function(user){

		return $http({
			method: 'POST',
			url: API_URL + '/login',
			data: user
		});
	};

	/* more functions */

	apiFactory.callUnprotected = function(){

		return $http({
			method: 'GET',
			url: API_URL + '/test'
		});
	};

	apiFactory.callProtected = function(){

		return $http({
			method: 'GET',
			url: API_URL + '/test/protect'
		});

	};

	apiFactory.uploadS3 = function(file, data){
		var fd = new FormData();
		fd.append('file', file);
		//fd.append('data', JSON.stringify(data));
		var myHeaders = {
			'Content-Type': undefined
		};
		return $http.post(API_URL + '/upload_s3', fd, {
			transformRequest: angular.identity,
			headers: myHeaders
		});
	};

	return apiFactory;
}]);