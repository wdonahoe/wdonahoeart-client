admin.controller('UploadCtrl', ['fileReaderFactory','$scope', function(fileReaderFactory, $scope){
	
	$scope.data = {};

	$scope.readFile = function() {
		fileReaderFactory.readAsDataUrl($scope.file, $scope)
			.then(function(result){
				$scope.imgSrc = result;
			});
	};

	$scope.$on('fileProgress', function(e, progress){
		$scope.progress = progress.loaded / progress.total;
	});

}]);