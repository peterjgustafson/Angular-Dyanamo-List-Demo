function ShoppingList(facebookId, createDateTime, info) {
    this.facebookId = facebookId;
    this.createDateTime = createDateTime;
    this.info = new ShoppingListInfo();
}
function ShoppingListInfo(currentUserName, listName, items) {
    this.currentUserName = currentUserName;
    this.listName = listName;
    this.items = this.items;
}
function ShoppingListItem(isChecked, isCategory, item) {
    this.isChecked = isChecked;
    this.isCategory = isCategory;
    this.item = item;
}

//Create a new shopping list
function newList(fbid, name, listName) {
    var newList = new ShoppingList();
    newList.facebookId = fbid;
    newList.createDateTime = new Date(+new Date + 12096e5).valueOf().toString();
    newList.info.currentUserName = name;
    newList.info.listName = listName;
    newList.info.items = [];
    return newList
}