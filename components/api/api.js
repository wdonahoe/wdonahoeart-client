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

	apiFactory.uploadS3 = function(file, fileData){
		return $http.post(API_URL + '/upload_s3',
			{
				file: file,
				fileData: fileData
			},
			{
				transformRequest: function(data){
					var formData = new FormData();

					formData.append("data", JSON.stringify(data.fileData));
					formData.append("file", data.file);

					return formData;
				},
				headers: {
					'Content-Type': undefined
			}
		});
	};

	apiFactory.getImageUrls = function(isBw){
		var urlParam = isBw ? 'bw' : 'color';
		return $http({
			method: 'GET',
			url: API_URL + '/drawings/' + urlParam
		});
	};

	return apiFactory;
}]);