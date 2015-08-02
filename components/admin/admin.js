angular.module('wdonahoeart-client.admin',[
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider.state('admin',{
		url: '/admin',
		controller: 'AdminCtrl',
		templateUrl: 'components/admin/admin.html',
		data: {
			requireLogin: true
		}
	});
})
.controller('AdminCtrl',function AdminController($scope){

});