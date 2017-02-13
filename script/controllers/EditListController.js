app.controller("editListController", function($scope, $location) {
    
    $scope.products = [];
    $scope.currentItem = "";
    $scope.currentItemIndex = 0;
    $scope.touchLocked = false;
    
    $("#listTitleInput").hide();
    
    if (typeof usersId == "undefined" || usersId == 0) {
        $location.path("/");
        return
    }
    
    if(myListObj.info.items != "undefined")
        $scope.products = myListObj.info.items;
    
    if(myListObj.info != "undefined")
        $scope.listName = myListObj.info.listName;
    
    //look for the back button or navigation other than from interating with the ui
    /*$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {

        console.log(newUrl)
        
        console.log(oldUrl)
        getAllLists(function(data){
            event.preventDefault();
            myLists = data;
            $scope.$apply();
            $scope.goto("Select");
        });
        
    });*/
    
    //Listen for scope change events 
    $scope.$watch('products', function(newValue, oldValue){
        console.log(JSON.stringify($scope.products));
        return;
    }, true);
    $scope.$watch('listName', function(newValue, oldValue){
        console.log(JSON.stringify($scope.listName));
        if(newValue != oldValue){
            myListObj.info.listName = newValue;
            createItem(myListObj);
            console.log("title changed to " + newValue);
            return;
        }
        
    }, true);
    $scope.goto = function(path){
        $location.path(path);
        $scope.$apply();
    }
    $scope.listProducts = function () {
        $scope.listName = myListObj.info.listName;
        $scope.products = [];
        if(myListObj.info.items == "undefined")
            return;
        for (var i = 0; i < myListObj.info.items.length; i++) {
            $scope.products.push(myListObj.info.items[i]);
        }
        $scope.currentItem = "";
        $scope.currentItemIndex = 0;
        $scope.$apply();
    }
    $scope.editName = function () {
       $("#listTitle").toggle();
       $("#listTitleInput").toggle();
       $("#listTitleInput").focus();
        return;
    }
    $scope.showName = function () {
       $("#listTitle").toggle();
       $("#listTitleInput").toggle();
        return;
    }
    $scope.addItem = function () {
        if (!$scope.addMe) {return;}
        $.toast().reset('all');
        
        
        if (!$scope.detectDuplicates()) {
        	console.log($scope.detectDuplicates());
            $scope.products.push(new ShoppingListItem(false, false, $scope.addMe));
            $scope.addMe = "";
            myListObj.info.items = $scope.products;
            createItem(myListObj);
            return;
        } else {
        $.toast({
            text: "The item '" + $scope.addMe + "' was already in your shopping list.",
            hideAfter: 2500,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
            
        }
        $("#addField").blur();
        $scope.addMe = "";
        return;
    }
    $scope.detectDuplicates = function () {
        //non-case-specific check for duplicates
        var duplicateItemIndex = -1;
        for(var item in $scope.products) {
            if($scope.products[item].item.toLowerCase() == $scope.addMe.toString().toLowerCase()) {
            	duplicateItemIndex++;
        		return true;
                break;
            }
        }
        return false;
    }
    $scope.removeItem = function (x) {
        $.toast().reset('all');
    	$scope.currentItemIndex = x;
    	$scope.currentItem = $scope.products[x];
    	$scope.currentItemName = $scope.products[x].item;
    	//$scope.errortext = "The item '" + $scope.products[x] + "' has been removed from your shopping list.";
        $scope.products.splice(x, 1);
        myListObj.info.items = $scope.products;
        
        createItem(myListObj);
        $.toast({
            text: $scope.currentItemName + ' has been deleted from your list.' + '<a href="javascript: angular.element(document.getElementById(\'baseApp\')).scope().undo();">undo</a>',
            hideAfter: 5000,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
    }
    $scope.undo = function () {
    	//a method to undo deleting from the list
        if($scope.currentItemIndex + 1 < $scope.products.length)
            $scope.products.splice($scope.currentItemIndex, 0, $scope.currentItem);
        else
            $scope.products.push($scope.currentItem);
        
        myListObj.info.items = $scope.products;
        
        createItem(myListObj);
        $.toast().reset('all');
        $.toast({
            text: $scope.currentItemName + ' has been restored.',
            hideAfter: 1500,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
        $scope.$apply();
    }
    $scope.onDropComplete = function (index, obj, evt) {
        $scope.touchLocked = false;
        var otherObj = $scope.products[index];
        var otherIndex = $scope.products.indexOf(obj);
        var tempObject = obj;
        $scope.products.splice(otherIndex, 1);
        $scope.products.splice(index, 0, tempObject);
        myListObj.info.items = $scope.products;
        createItem(myListObj);
    }
    $scope.onDragStart = function() {
        $scope.touchLocked = true;
    }
    $('#appBody').bind('touchmove',function(e){
        if($scope.touchLocked)  
            e.preventDefault();
    });
        
});