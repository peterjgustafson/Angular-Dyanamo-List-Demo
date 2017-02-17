app.controller("defaultController", function($scope, $window, $location, $state) {
    if(usersId == 0) {
        $scope.showFBLogin = false;
        $scope.isLoggedInFb = false;
    }
    else {
        $scope.welcomeMsg = "Welcome back " + usersName + "!";
        $scope.showFBLogin = false;
        $scope.isLoggedInFb = true;
    }
    
    $scope.goto = function(path){
        //$location.path(path);
        $state.go(path);
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
                  // Logged into your app and Facebook.
                    $scope.getFbUserInfo(function(){
                    
                    getAllLists(function(data){
                        myLists = data;
                        $scope.$apply(function(){
                            if(myLists.Count == 0)
                                $scope.welcomeMsg = "Welcome " + usersName + "!";
                            else
                                $scope.welcomeMsg = "Welcome back " + usersName + "!";
                            $scope.showFBLogin = false;
                            $scope.isLoggedInFb = true;
                        });
                    });
                });
            } else if (response.status === 'not_authorized') {
              // The person is logged into Facebook, but not your app.
                console.log('Please log  into this app.');
                
                $scope.$apply(function(){
                    $scope.showFBLogin = true;
                });
            } else {
              // The person is not logged into Facebook, so we're not sure if
              // they are logged into this app or not.
                console.log('Please log into Facebook.');
                
                $scope.$apply(function(){
                            $scope.showFBLogin = true;
                });
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