angular.module('wdonahoeart.jwtAuth', [

])
.service('jwtAuthService', function($window){
	var self = this;

	self.parseJwt = function(token){
		var base64Url = _.first(token.split('.'));
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse($window.atob(base64));
	}

	self.saveToken = function(token){
		$window.localStorage['jwtToken'] = token;
	}

	self.getToken = function(){
		return $window.localStorage['jwtToken'];
	}

	self.destroyToken = function(){
		$window.localStorage.removeItem('jwtToken');
	}

	self.isAuthed = function(){
		var token = self.getToken();
		if (token){
			var params = self.parseJwt(token);
			return _.round(new Date().getTime() / 1000) <= params.exp;
		}
		else {
			return false;
		}
	}
});