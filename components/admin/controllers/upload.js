admin.controller('UploadCtrl', ['apiFactory','$scope', '$timeout', '$state', function(apiFactory, $scope, $timeout, $state){

	var data_keys = ['title','medium','width','height','isBw'];
	var imgUploaded = false;

	$scope.allFilled = function() {
		var keys = _.keys($scope.data)
		//return !(_.isEmpty(_.difference(data_keys, keys)) && $scope.file);
		return false;
	}

	$scope.upload = function(){
		$scope.loading = true;

		apiFactory.uploadS3($scope.file, $scope.data)
			.then(function(result){
				
				$timeout(function(){

					$scope.myForm.$setPristine();
					$scope.myForm.$setUntouched();
					$scope.data = {};
					imgUploaded = false;
					$scope.loading = false;

					var toGo = result.data.isBw ? "shades-of-gray" : "color";

					$state.go('gallery.' + toGo);
				}, 15000);
				

			}, function(error){
				console.log(error);
			}
		);
	};

}])
.directive('spinner', function(){
	return {
		restrict: 'E',
		replace: true,
		template: '<span class="spinner"><img class="img-responsive center-block" src="static/loading-spinning-bubbles.svg" /></span>',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					$(element).show();
				else
					$(element).hide();
			});
		}
	};
})
.directive('fadeOut', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					element.toggleClass("fadez");				
			});
		}
	};
});