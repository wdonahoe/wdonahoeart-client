app.directive('scrollpane',function($compile){
	return {
		restrict: 'E',
		link: function(scope, element, attrs){
			element.addClass('scroll-pane');
			$(element).jScrollPane();
		}
	}
})