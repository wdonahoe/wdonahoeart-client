admin.controller('UploadCtrl', ['apiFactory','fileReaderFactory','$scope', '$timeout', '$state', function(apiFactory, fileReaderFactory, $scope, $timeout, $state){
	var self = this;

	var data_keys = ['title','medium','width','height','isBw'];
	var imgUploaded = false;

	self.imgSrc;

	self.allFilled = function() {
		var keys = _.keys(self.data)
		return !(_.isEmpty(_.difference(data_keys, keys)) && $scope.file);
	}

	self.getFile = function(){
		fileReaderFactory.readAsDataURL($scope.file, $scope)
			.then(function(result){
				self.imgSrc = result;
			});
	}

	self.upload = function(){
		$scope.loading = true;

		apiFactory.uploadS3($scope.file, self.data)
			.then(function(result){
				
				$timeout(function(){

					self.myForm.$setPristine();
					self.data = {};
					imgUploaded = true;

					var toGo = result.data.isBw ? "shades-of-gray" : "color";

					$state.go('gallery.views', {gallery: toGo});
				}, 500);
				

			}, function(error){
				console.log(error);
			}
		);
	};

}]);