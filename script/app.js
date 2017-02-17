var app = angular.module("myShoppingList", ['ui.router','ngDraggable','ngAnimate','ngSanitize'])
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('Home', {
            url: '/',
            templateUrl: 'views/DefaultView.html',
            controller: 'defaultController',
            controllerAs: 'vm'
        })
        .state('Select', {
            url: '/Select',
            templateUrl: 'views/SelectListView.html',
            controller: 'selectListController',
            controllerAs: 'vm'
        })
        .state('Edit', {
            url: '/Edit',
            templateUrl: 'views/EditListView.html',
            controller: 'editListController',
            controllerAs: 'vm'
        });
    
    /*$routeProvider
        // route for the home page
        .when('/Edit', {
            templateUrl : 'views/EditListView.html',
            controller  : 'editListController'
        })

        .when('/Select', {
            templateUrl : 'views/SelectListView.html',
            controller  : 'selectListController'
        })

        .when('/', {
            templateUrl : 'views/DefaultView.html',
            controller  : 'defaultController'
        })*/
            
});
