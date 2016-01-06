var admin = angular.module('wdonahoeart.admin',[
	'ngResource',
	'ui.router',
	'dndLists',
	'wdonahoeart.fileReader'
]);

function getImageUrls2(apiFactory){
	return apiFactory.getImageUrls();
}
getImageUrls2.$inject = ['apiFactory'];

function getDrawing(apiFactory, $stateParams){
	return apiFactory.getDrawing($stateParams.id);
}
getDrawing.$inject = ['apiFactory','$stateParams'];

admin.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: 'components/admin/admin.html',
			data: {
				requiresLogin: true
			}
		})
		.state('admin.upload', {
			url: '',
			templateUrl: 'components/admin/partials/admin.upload.html',
			controller: 'UploadCtrl',
		})
		.state('admin.edit', {
			url: '/edit',
			templateUrl: 'components/admin/partials/admin.edit.html',
			resolve: {
				drawings: getImageUrls2
			},
			controller: ['drawings', 'apiFactory', '$state', function(drawings, apiFactory, $state){
				this.drawings = drawings.data;
				this.orig = this.drawings;

				this.reorder = function(){
					var self = this;
					if (_.every(self.drawings, self.orig)){
						return false;
					} else { 
						apiFactory.reorderDrawings(self.drawings).then(function(res){
							if (!_.every(self.drawings.bw, self.orig.bw))
								$state.go('gallery.views', {gallery: 'shades-of-gray'});
							else
								$state.go('gallery.views', {gallery: 'color'});
						});
					}
				}
			}],
			controllerAs: 'ctrl'
		})
		.state('admin.edit-drawing', {
			url: '/edit/{id}',
			templateUrl: 'components/admin/partials/admin.edit-drawing.html',
			resolve: {
				drawing: getDrawing
			},
			controller: ['drawing','$scope','apiFactory', 'fileReaderFactory', '$timeout', '$state', function(drawing, $scope, apiFactory, fileReader, $timeout, $state){
				var self = this;
				self.drawing = drawing.data;
				self.imgSrc = self.drawing.url;

				var data_keys = ['title','medium','width','height','isBw'];
				self.allFilled = function() {
					var keys = _.keys(self.drawing)
					return !(_.isEmpty(_.difference(data_keys, keys)));
				}

				self.getFile = function(){
					fileReader.readAsDataURL($scope.file, $scope)
						.then(function(result){
							self.imgSrc = result;
						});
				}

				self.upload = function(){
					$scope.loading = true;

					apiFactory.editDrawing($scope.file, self.drawing)
						.then(function(result){		
							$timeout(function(){
								self.myForm.$setPristine();			

								var toGo = result.data.isBw ? "shades-of-gray" : "color";
								$state.go('gallery.views', {gallery: toGo});
							}, 500);
						}, function(error){
							console.log(error);
						}
					);
				}

			}],
			controllerAs: 'ctrl'
		});

}])
.directive('editList', function(){
	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			drawings: '='
		},
		templateUrl: 'components/admin/partials/admin.edit-list.html',
		controller: ['apiFactory', '$state', function(apiFactory, $state){	
		}],
		controllerAs: 'ctrl',
	}
});