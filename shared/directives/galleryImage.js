app.directive('galleryImage', function(){
	return {
		restrict: 'E',
		scope: {
			drawing: '='
		},
		template: '<img class="gallery-img" ng-src="{{drawing.url | trusted}}"></img>' +
				  '{{drawing.title}} - {{drawing.width}}\" x {{drawing.height}}\", {{drawing.medium}}'
	}
})