app.directive('fadeOut', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					element.toggleClass("fadez");				
			});
		}
	};
});