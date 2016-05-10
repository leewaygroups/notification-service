rootApp.directive('notifrTopnav', function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'topnavTemplate.html',
		controller: 'topnavController'
	};
});