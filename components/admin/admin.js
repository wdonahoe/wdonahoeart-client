var admin = angular.module('wdonahoeart.admin',[
	'ngResource',
	'ui.router'
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
			controller: function(drawings){
				this.drawings = drawings.data;
			},
			controllerAs:'ctrl'
		})
		.state('admin.edit-document', {
			url: '/edit-document',
			templateUrl: 'components/admin/partials/admin.edit-document.html',
			controller: 'DocEditCtrl'
		});

})
.directive('editList', function(){
	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			drawings: '='
		},
		template: '<div ng-repeat="drawing in ctrl.drawings">' +
					'<ul><edit-drawing title="{{drawing.title}}"></edit-drawing></ul>' +
				  '</div>',
		controller: function(){},
		controllerAs: 'ctrl',
	}
})
.directive('editDrawing', function(){
	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			title: '@'
		},
		template: '<li>{{ctrl.title}}</li>',
		controller: function(){},
		controllerAs: 'ctrl',
		require: '^editList'
	}
})