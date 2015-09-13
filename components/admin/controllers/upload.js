admin.controller('UploadCtrl', ['apiFactory','$scope', function(apiFactory, $scope){
	
	$scope.data = {
		title:'Deer Isle Cottage',
		medium: 'charcoal and graphite',
		width: 26,
		height: 16,
		isBw: true
	};

	var data_keys = ['title','medium','width','height','isBw'];
	var imgUploaded = false;

	$scope.allFilled = function() {
		var keys = _.keys($scope.data)
		return !(_.isEmpty(_.difference(data_keys, keys)) && $scope.file);
	}

	$scope.upload = function(){
		apiFactory.uploadS3($scope.file, $scope.data)
			.then(function(result){
				
				$scope.myForm.$setPristine();
				$scope.myForm.$setUntouched();
				$scope.data = {};
				imgUploaded = false;

			}, function(error){
				console.log(error);
			}
		);
	};

}]);