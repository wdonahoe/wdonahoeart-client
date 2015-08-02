angular.module( 'wdonahoeart-client.login', [
  'ui.router'
])
.config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    templateUrl: 'components/login/login.html',
    data: {
      requireLogin: false
    }
  });
})
.controller( 'LoginCtrl', function LoginController($scope, $http) {

  $scope.user = {};

  $scope.login = function() {
    $http({
      url: 'http://localhost:8080/api/login',
      method: 'POST',
      data: $scope.user
    }).then(function(response) {
      console.log(response.user)
      $scope.$close(response.user);
    });
  }
});
