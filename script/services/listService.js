(function () {
    'use strict';
//i am in the process of implementing this service, the plan is to call the AWS dyanamo methods in the script/dynamo folder instead of calling them directly from the controllers
    angular
        .module('myShoppingList')
        .factory('ListService', Service);

    function Service($filter) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Save = Save;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return getLists();
        }

        function GetById(id) {
            var filtered = $filter('filter')(getLists(), { id: id });
            var list = filtered.length ? filtered[0] : null;
            
            return list;
        }

        function Save(list) {
            var lists = getLists();

            if (list.id) {
                // update existing list
                
                for (var i = 0; i < lists.length; i++) {
                    if (lists[i].id === list.id) {
                        lists[i] = list;
                        break;
                    }
                }
                setLists(lists);
            } else {
                // create new list
                
                // assign id
                var lastList = lists[lists.length - 1] || { id: 0 };
                list.id = lastList.id + 1;
    
                // save to local storage
                lists.push(list);
                setLists(lists);
            }

            return;
        }

        function Delete(id) {
            var lists = getLists();
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                if (list.id === id) {
                    lists.splice(i, 1);
                    break;
                }
            }
            setLists(lists);
            
            return;
        }

        // private functions

        function getLists() {
            if (!localStorage.lists) {
                localStorage.lists = JSON.stringify([]);
            }

            return JSON.parse(localStorage.lists);
        }

        function setLists(lists) {
            localStorage.lists = JSON.stringify(lists);
        }
    }
})();