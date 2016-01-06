angular.module('wdonahoeart.jwtAuth', [
])
.factory('jwtAuthFactory', ['$window', function($window){
	var jwtAuthFactory = {};

	jwtAuthFactory.parseJwt = function(token){
		var base64Url = _.first(token.split('.'));
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse($window.atob(base64));
	}

	jwtAuthFactory.storeToken = function(token, user){
		$window.localStorage['jwtToken'] = token;
		$window.localStorage['user'] = user;
	}

	jwtAuthFactory.getToken = function(){
		return $window.localStorage['jwtToken'];
	}

	jwtAuthFactory.getUser = function(){
		return $window.localStorage['user'];
	}

	jwtAuthFactory.destroyAuth = function(){
		$window.localStorage.removeItem('jwtToken');
		$window.localStorage.removeItem('user');
	}

	jwtAuthFactory.isAuthed = function(){
		var token = this.getToken();
		var user = this.getUser();
		if (token && user){
			var params = this.parseJwt(token);
			return true;
		}
		else {
			return false;
		}
	}

	return jwtAuthFactory;
}]);