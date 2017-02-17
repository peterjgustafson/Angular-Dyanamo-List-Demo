app.controller("selectListController", function($scope, $location, $state) {
    $scope.lists = [];
    
    if (typeof usersId == "undefined" || usersId == 0) {
        $state.go("Home");
        return
    }
    
    if (myLists.Count != 0) {
            $scope.viewTitle = "Select a list to edit";
    }
    else {
            $scope.viewTitle = "Create your first list";
    }
    
    getAllLists(function(data){
        if (data.Count != 0) {//this will make sure it doesn't break for new users
            myLists = data;//Existing User
            
            $scope.$apply(function(){$scope.lists = myLists.Items;});
        }
    });
    
    
    
    /*if(myLists.Items)
        $scope.lists = myLists.Items;*/
    
    $scope.getLists = function(){
        
        $scope.$apply(function(){$scope.lists = myLists.Items;});
    }
    $scope.selectList = function(x){
        myListObj = new ShoppingList();
        myListObj.info = new ShoppingListInfo();
        myListObj.facebookId = x.facebookId;
        myListObj.createDateTime = x.createDateTime;
        myListObj.info.currentUserName = x.info.currentUserName;
        myListObj.info.listName = x.info.listName;
        myListObj.info.items = [];
        if(x.info.items.length > 0) {
            JSON.parse(x.info.items).forEach(function (xItem) {
                myListObj.info.items.push(new ShoppingListItem(xItem.isChecked, xItem.isCategory, xItem.item));
            });
        }
        console.log(angular.toJson(myListObj));
        $state.go("Edit");
    }
    $scope.goto = function(path){
        $scope.$apply(function(){
            $state.go(path);
        });
    }
    $scope.addItem = function () {
        if (!$scope.addMe) {return;}
        $.toast().reset('all');
        
        
        if (!$scope.detectDuplicates()) {
        	console.log($scope.detectDuplicates());
            myListObj = newList(usersId, usersName, $scope.addMe);
            $scope.lists.unshift(myListObj);
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
    $scope.formatDate = function (dateOrd) {
        //non-case-specific check for duplicates
       var dateAsString = new Date(eval(dateOrd));
        
        return (dateAsString.getMonth() + 1) + "/" + dateAsString.getDate() + "/" + dateAsString.getFullYear() + " @ " + dateAsString.getHours() + ":" + dateAsString.getMinutes();
    }
    //remove
    $scope.removeList = function (x) {
        $.toast().reset('all');
    	
        
        $.toast({
            text: 'Are you sure you want to delete ' + $scope.lists[x].info.listName + ' from your list. <a href="javascript: angular.element(document.getElementById(\'baseApp\')).scope().$$childHead.confirmDelete(' + x + ');" class=".jq-toast-single">Confirm</a>',
            hideAfter: 5000,
            position : 'bottom-center',
            showHideTransition: "slide"
        });
    }
    
    //confirm delete
    $scope.confirmDelete = function (x) {
        
        $.toast().reset('all');
        
        deleteItem($scope.lists[x].facebookId, $scope.lists[x].createDateTime);
        myLists.Items.splice(x, 1);
        $scope.lists = myLists.Items;
        $scope.$apply();
    }
    
    
});