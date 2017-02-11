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