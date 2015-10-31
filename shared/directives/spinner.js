app.directive('spinner', function(){
	return {
		restrict: 'E',
		replace: true,
		template: '<span class="spinner"><img class="img-responsive center-block" src="static/loading-spinning-bubbles.svg" /></span>',
		link: function(scope, element, attr){
			scope.$watch('loading', function(val){
				if (val)
					$(element).show();
				else
					$(element).hide();
			});
		}
	};
});