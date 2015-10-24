var admin = angular.module('wdonahoeart.admin',[
	'ngResource',
	'ui.router',
	'dndLists'
]);

admin.config(function($stateProvider){
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
				apiFactory: 'apiFactory',
				drawings: function(apiFactory){
					return apiFactory.getImageUrls();
				}
			},
			controller: ['drawings', 'apiFactory', '$state', function(drawings, apiFactory, $state){
				this.drawings = drawings.data;
				this.orig = this.drawings;

				this.reorder = function(){
					var self = this;
					if (_.every(self.drawings, self.orig)){
						return false;
					} else { 
						apiFactory.reorderDrawings(self.drawings).then(function(){
							if (!_.every(self.drawings.bw, self.orig.bw))
								$state.go('gallery.views', {gallery: 'shades-of-gray'});
							else
								$state.go('gallery.views', {gallery: 'color'});
						});
					}
				}
			}],
			controllerAs:'ctrl'
		})
		.state('admin.edit-drawing', {
			url: '/edit/{title}',
			templateUrl: 'components/admin/partials/admin.edit-drawing.html',
			resolve: {
				apiFactory: 'apiFactory',
				drawing: function(apiFactory, $stateParams){
					return apiFactory.getDrawing($stateParams.title);
				}
			}
		});

})
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
})