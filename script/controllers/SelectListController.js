app.controller("selectListController", function($scope, $location) {
    $scope.lists = [];
    
    if (typeof usersId == "undefined" || usersId == 0) {
        $location.path("/");
        return
    }
    
    getAllLists(function(data){
        if (data.Count != 0) {//this will make sure it doesn't break for new users
            myLists = data;//Existing User
            $scope.lists = myLists.Items;
            $scope.$apply();
        }
        else {
            //
        }
    });
    
    
    
    /*if(myLists.Items)
        $scope.lists = myLists.Items;*/
    
    $scope.getLists = function(){
        $scope.lists = myLists.Items;
        $scope.$apply();
    }
    $scope.selectList = function(x){
        myListObj = new ShoppingList();
        myListObj.info = new ShoppingListInfo();
        myListObj.facebookId = x.facebookId;
        myListObj.createDateTime = x.createDateTime;
        myListObj.info.currentUserName = x.info.currentUserName;
        myListObj.info.listName = x.info.listName;
        myListObj.info.items = [];
        if(x.info.items) {
            JSON.parse(x.info.items).forEach(function (xItem) {
                myListObj.info.items.push(new ShoppingListItem(xItem.isChecked, xItem.isCategory, xItem.item));
            });
        }
        console.log(angular.toJson(myListObj));
        $location.path("/Edit");
    }
    $scope.goto = function(path){
        $location.path(path);
        $scope.$apply();
    }
    $scope.addItem = function () {
        if (!$scope.addMe) {return;}
        $.toast().reset('all');
        
        
        if (!$scope.detectDuplicates()) {
        	console.log($scope.detectDuplicates());
            myListObj = newList(usersId, usersName, $scope.addMe);
            $scope.lists.push(myListObj);
            $scope.addMe = "";
            myLists.Items = $scope.lists;
            createItem(myListObj);
            return;
        } else {
        $.toast({
            text: "The item '" + $scope.addMe + "' was already in your shopping list.",
            hideAfter: 1500,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
        }
        $("#addListField").blur();
        $scope.addMe = "";
        return;
    }
    $scope.detectDuplicates = function () {
        //non-case-specific check for duplicates
        var duplicateItemIndex = -1;
        for(var item in $scope.lists) {
            if($scope.lists[item].info.listName.toLowerCase() == $scope.addMe.toString().toLowerCase()) {
            	duplicateItemIndex++;
        		return true;
                break;
            }
        }
        return false;
    }
    
    //remove
    
    //undo
    
    
});