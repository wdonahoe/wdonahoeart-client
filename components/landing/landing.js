angular.module('wdonahoeart.landing', [
	'ui.router'
])
.config(function($stateProvider){
	$stateProvider.state('landing', {
		url: '/',
		templateUrl: 'components/landing/landing.html',
		controller: 'LandingCtrl as ctrl'
	});
})
.controller('LandingCtrl', function($timeout){
	var self = this;
	var interval = 5000;
	var currentIndex = 0;
	var start = true;

	self.slides = [
		{src: 'https://s3.amazonaws.com/wdonahoeart/BostonGirl_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/APearofHands_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/Olivia_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/BagLunch_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/IslandFairy_Landing.jpg', loaded: false},
		{src: 'https://s3.amazonaws.com/wdonahoeart/DistantCousins_Landing.jpg', loaded: false}
	];

	self.setCurrentIndex = function(index){
		currentIndex = index;
	}

	self.isCurrentIndex = function(index){
		return currentIndex === index;
	}

	self.nextSlide = function(){
		if (start){
			start = false;
		} else {
			self.slides[currentIndex].loaded = false;
			currentIndex = (currentIndex < self.slides.length - 1) ? ++currentIndex : 0;
		}
		self.slides[currentIndex].loaded = true;
		$timeout(self.nextSlide, interval);
	}

	this.loadSlides = function(){
	    $timeout(self.nextSlide, 0);
	}

	self.loadSlides();
});