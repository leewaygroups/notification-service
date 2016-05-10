rootApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/index');
    
    $stateProvider
        
        .state('index', {
            url: '/index',
            templateUrl: 'partial-index.html'
        })
        
        .state('about', {
            // we'll get to this in a bit      
        });
        
});