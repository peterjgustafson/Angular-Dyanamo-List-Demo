var app = angular.module("myShoppingList", ['ngRoute','ngDraggable']);
app.config(function($routeProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
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
        })
            
});
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
app.controller("defaultController", function($scope, $window, $location) {
    $scope.showFBLogin = false;
    $scope.isLoggedInFb = false;
    
    $scope.goto = function(path){
        $location.path(path);
        $scope.$apply();
    }
    $window.fbAsyncInit = function() {
        FB.init({
        appId      : '727569714066215',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
        });

        FB.getLoginStatus(function(response) {
        $scope.fBstatusChangeCallback(response);
        });

    };
    
    // Load the FB SDK asynchronously
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
    
    $scope.fBcheckLoginState = function() {
        FB.getLoginStatus(function(response) {
          $scope.fBstatusChangeCallback(response);
        });
      }
    $scope.fBstatusChangeCallback = function(response) {
            console.log('statusChangeCallback');
            console.log(response);

            if (response.status === 'connected') {
                $scope.isLoggedInFb = true;
              // Logged into your app and Facebook.
                $scope.getFbUserInfo(function(){
                    getAllLists(function(data){
                        myLists = data;
                        $scope.$apply();
                    });
                });
            } else if (response.status === 'not_authorized') {
              // The person is logged into Facebook, but not your app.
              console.log('Please log  into this app.');
            } else {
              // The person is not logged into Facebook, so we're not sure if
              // they are logged into this app or not.
              console.log('Please log into Facebook.');
            }
          }
    $scope.getFbUserInfo = function(callback) {
            FB.api('/me', function(response) {
                usersId = response.id;
                usersName = response.name;
                console.log('Successful FB login for: ' + response.name);
                callback();
            });
          }
    });