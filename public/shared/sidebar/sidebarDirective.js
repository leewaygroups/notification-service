rootApp.directive('notifrSidebar', function(){
	return {
		restrict: 'E',
		templateUrl: 'sidebarTemplate.html',
		controller: 'sidebarController'
	};
});