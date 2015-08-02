angular.module( 'wdonahoeart-client', [
  'wdonahoeart-client.home',
  'wdonahoeart-client.login',
  'wdonahoeart-client.admin',
  'ui.router',
  'ui.bootstrap'
])
.config( function myAppConfig($httpProvider) {
	$httpProvider.interceptors.push(function($timeout, $q, $injector){
		var loginModal, $http, $state;

		$timeout(function(){
			loginModal = $injector.get('loginModal');
			$http = $injector.get('$http');
			$state = $injector.get('$state');
		});

		return {
			responseError: function(rejection){
				if (rejection.status !== 401){
					return rejection;
				}

				var deferred = $q.defer();

				loginModal()
					.then(function(){
						deferred.resolve($http(rejection.config));
					})
					.catch(function(){
						$state.go('home');
						deferred.reject(rejection);
					});
				return deferred.promise;
			}
		};
	});
})
.run(function($rootScope, $state, loginModal){

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams){

		var requireLogin = toState.data.requireLogin;

		if (requireLogin && typeof $rootScope.currentUser === undefined){
			event.preventDefault();

			loginModal()
				.then(function(){
					return $state.go(toState.name, toParams);
				})
				.catch(function(){
					return $state.go('home');
				});
		}

	});
})
.service('loginModal', function($modal, $rootScope){

	function assignCurrentUser(user){
		$rootScope.currentUser = user;
		return user;
	}

	return function(){
		var instance = $modal.open({
			templateUrl: 'components/login/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'LoginCtrl'
			});
			return instance.result.then(assignCurrentUser);
		};

})
.controller( 'AppCtrl', function AppCtrl($scope, $location) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Wendy Donahoe Art' ;
    }
  });
});

