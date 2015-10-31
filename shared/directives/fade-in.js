app.directive('fadeIn', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			element.on('load', function(){
				element.addClass("fadeIn");
			});
		}
	};
});