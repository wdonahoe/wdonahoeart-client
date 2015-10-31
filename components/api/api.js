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
			}
		);
	};

	apiFactory.editDrawing = function(file, drawing){
		return $http.put(API_URL + '/drawing/' + drawing._id,
			{
				file: file ? file : undefined,
				drawing: _.omit(drawing, 'dimensions')
			},
			{
				transformRequest: function(data){
					var formData = new FormData();

					formData.append("drawing", JSON.stringify(data.drawing));
					formData.append("file", data.file);

					return formData;
				},
				headers: {
					'Content-Type': undefined
				}
			}
		);
	};


	apiFactory.reorderDrawings = function(drawings){

		return $http({
			method: 'POST',
			url: API_URL + '/drawings/reorder',
			data: {bw: drawings.bw, color: drawings.color}
		});
	}

	apiFactory.getImageUrls = function(gallery){
		if (gallery === undefined)
			var gallery = 'all'

		return $http({
			method: 'GET',
			url: API_URL + '/drawings/' + gallery
		});
	};

	apiFactory.getDrawing = function(id){

		return $http({
			method: 'GET',
			url: API_URL + '/drawing/' + id
		});

	}

	return apiFactory;
}]);