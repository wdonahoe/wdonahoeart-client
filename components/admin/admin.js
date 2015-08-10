var admin = angular.module('wdonahoeart.admin',[ 
	'wdonahoeart.fileReader',
	'ui.router'
]);

admin.config(function($stateProvider){
	$stateProvider
		.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: 'components/admin/admin.html',
			controller: 'AdminCtrl',
			data: {
				requiresLogin: true
			}
		})
		.state('admin.upload', {
			url: '',
			templateUrl: 'components/admin/partials/admin.upload.html',
			controller: 'UploadCtrl'
		})
		.state('admin.edit', {
			url: '/edit/{title}',
			templateUrl: 'components/admin/partials/admin.edit.html',
			controller: 'ImgEditCtrl'
		})
		.state('admin.edit-document', {
			url: '/edit-document',
			templateUrl: 'components/admin/partials/admin.edit-document.html',
			controller: 'DocEditCtrl'
		});

})
.controller('AdminCtrl', function($scope){

});