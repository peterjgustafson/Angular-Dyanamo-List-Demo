app.controller("selectListController", function($scope, $location) {
    $scope.lists = [];
    getAllLists();
    $scope.getLists = function(path){
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
        JSON.parse(x.info.items).forEach(function (xItem) {
            myListObj.info.items.push(new ShoppingListItem(xItem.isChecked, xItem.isCategory, xItem.item));
        });
        console.log(angular.toJson(myListObj));
        $location.path("/Edit");
    }
    $scope.goto = function(path){
        $location.path(path);
        $scope.$apply();
    }
});