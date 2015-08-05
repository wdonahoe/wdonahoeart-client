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
		link: function(scope, element, attr){
			element.find("label").text(_.capitalize(attr.type));
		}
	};
});