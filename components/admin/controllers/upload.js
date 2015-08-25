admin.controller('UploadCtrl', ['apiFactory','fileReaderFactory','$scope', function(apiFactory, fileReaderFactory, $scope){
	
	$scope.data = {};
	$scope.fileData = {};

	var data_keys = ['title','medium','dimensions','isBw'];
	var imgUploaded = false;

	// $scope.readFile = function() {
	// 	fileReaderFactory.readAsDataUrl($scope.file, $scope)
	// 		.then(function(result){
	// 			$scope.imgSrc = result;
	// 			imgUploaded = true;
	// 		});
	// };

	$scope.allFilled = function() {
		var keys = _.keys($scope.data)
		return !(_.isEmpty(_.difference(data_keys, keys)) && imgUploaded);
	}

	$scope.upload = function(){
		var fileData = {
			name: $scope.file.name,
			type: $scope.file.type
		};
		apiFactory.uploadS3($scope.file)
			.then(function(result){
				console.log(result);
			}, function(error){
				console.log(error);
			});
	};

	$scope.$on('fileProgress', function(e, progress){
		$scope.progress = progress.loaded / progress.total;
	});

	$scope.$on('fileData', function(e, fileData){
		$scope.fileData = fileData;
	});

}]);