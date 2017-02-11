app.controller("editListController", function($scope) {
    /*$scope.listName = myListObj.listName;
    
    for (var i = 0; i < myListObj.items.length; i++) {
        $scope.products.push(myListObj.items[i]);
    }*/
    //DBInit();
    $scope.products = [];
    if(myListObj.info.items != "undefined")
        $scope.products = myListObj.info.items;
    
    if(myListObj.info != "undefined")
        $scope.listName = myListObj.info.listName;
    $scope.currentItem = "";
    $scope.currentItemIndex = 0;
    $("#undo-button").hide();
    $("#listTitleInput").hide();
    //Listen for scope change events 
    $scope.$watch('products', function(newValue, oldValue){
        console.log(JSON.stringify($scope.products));
        return;
    }, true);
    $scope.$watch('listName', function(newValue, oldValue){
        console.log(JSON.stringify($scope.listName));
        if(newValue != oldValue){
            myListObj.info.listName = newValue;
            createItem();
            console.log("title changed to " + newValue);
            //$scope.listProducts();
            return;
        }
        
    }, true);
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
        $("#undo-button").hide();
        if (!$scope.addMe) {return;}
        $.toast().reset('all');
        
        
        if (!$scope.detectDuplicates()) {
        	console.log($scope.detectDuplicates());
            $scope.products.push(new ShoppingListItem(false, false, $scope.addMe));
            $scope.addMe = "";
            myListObj.info.items = $scope.products;
            createItem();
            return;
        } else {
        $.toast({
            text: "The item '" + $scope.addMe + "' was already in your shopping list.",
            hideAfter: 1500,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
        //$scope.errortext = "The item '" + $scope.addMe + "' is already in your shopping list.";
        //$("#errorText").show();
        ///$("#errorText").fadeOut(1800);
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
        
        createItem();
        $.toast({
            text: $scope.currentItemName + 'has been deleted from your list.' + '<a href="javascript: angular.element(document.getElementById(\'baseApp\')).scope().undo();">undo</a>',
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
        
        createItem();
        $.toast().reset('all');
        $.toast({
            text: $scope.currentItemName + ' has been restored.',
            hideAfter: 1500,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
        $scope.$apply();
    }
});