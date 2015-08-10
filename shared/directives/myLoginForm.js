app.directive('myLoginForm', function(){
	return {
		restrict: 'E',
		scope: { 
			name: '@',
			type: '@',
			field: '='
		},
		controller: 'LoginCtrl',
		templateUrl: 'shared/templates/myLoginForm.html',
		link: function(scope, element, attrs){
			element.find("label").text(_.capitalize(attrs.name));
		}
	};
});