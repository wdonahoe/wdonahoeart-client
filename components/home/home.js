angular.module( 'wdonahoeart-client.home', [
  'ui.router'
])
.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: 'components/home/home.html',
    data: {
    	requireLogin: false
    }
  });
})
.controller( 'HomeCtrl', function HomeController( $scope, $http) {

});
