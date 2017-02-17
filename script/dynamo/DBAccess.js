
//configure for unauthenticated Cognito Users
    
AWS.config.update({
  region: "us-east-1"
});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:d8a4ba7a-9a08-4a57-98ee-6b914f1a5ff6",
    RoleArn: "arn:aws:iam::086091108037:role/Cognito_DynamoUnAuthUnauth_Role"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function DBInit() {
    //
    //createDBTable();
    getAllLists();
}

function createDBTable() {
    var params = {
        TableName : "extensibleLists",
        KeySchema: [
            { AttributeName: "facebookId", KeyType: "HASH"},
            { AttributeName: "createDateTime", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [       
            { AttributeName: "facebookId", AttributeType: "S" },
            { AttributeName: "createDateTime", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.log("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Created table: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
    
}

function createItem(obj) {
    var params = {
        TableName :"extensibleLists",
        Item: {
                "facebookId": obj.facebookId,
                "createDateTime": obj.createDateTime,
                "info": {
                            "currentUserName": obj.info.currentUserName,
                            "listName": obj.info.listName,
                            "items": JSON.stringify(obj.info.items)
                }
            }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2)) + "\nObj: " + JSON.stringify(obj);
        } else {
            console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)) + "\n" + JSON.stringify(obj);
        }
    });
}
function getList(facebookId, createDateTime) {
    var params = {
        TableName : "extensibleLists", 
        KeyConditionExpression: "#fbid = :fbuserid AND #dtord = :cdtime",
        ExpressionAttributeNames:{
            "#fbid": "facebookId",
            "#dtord": "createDateTime"
        },
        ExpressionAttributeValues: {
            ":fbuserid": facebookId,
            ":cdtime": createDateTime
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log(JSON.stringify(data.Items[2]));
            myListObj = new ShoppingList();
            myListObj.info = new ShoppingListInfo();
            myListObj.facebookId = data.Items[2].facebookId;
            myListObj.createDateTime = data.Items[2].createDateTime;
            myListObj.info.currentUserName = data.Items[2].info.currentUserName;
            myListObj.info.listName = data.Items[2].info.listName;
            myListObj.info.items = [];
            JSON.parse(data.Items[2].info.items).forEach(function (xItem) {
                myListObj.info.items.push(new ShoppingListItem(xItem.isChecked, xItem.isCategory, xItem.item));
            });
           // myListObj.info.items = JSON.parse(data.Items[2].info.items);
            //angular.element(document.getElementById('baseApp')).scope().listProducts();
            data.Items.forEach(function(xList) {
                myLists.facebookId = xList.facebookId;
                myLists.createDateTime = xList.createDateTime;
                myLists.listName = xList.listName;
            });
            console.log(JSON.stringify(myLists));
        }
    });
}
function getAllLists(callback) {
    var params = {
        TableName : "extensibleLists", 
        KeyConditionExpression: "#fbid = :fbuserid",
        ScanIndexForward: false,
        ExpressionAttributeNames:{
            "#fbid": "facebookId"
        },
        ExpressionAttributeValues: {
            ":fbuserid": usersId
        }
    };
    
    console.log(JSON.stringify(params));
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log(JSON.stringify(data));
            callback(data);
            //myLists = data;
            //angular.element(document.getElementById('baseApp')).scope().getLists();
        }
    });
}
function deleteItem(fbid, creationDate) {
    var table = "extensibleLists";
    var facebookId = fbid;
    var createDateTime = creationDate;

    var params = {
        TableName:table,
        Key:{
            "facebookId":fbid,
            "createDateTime":creationDate
        }
    };
    docClient.delete(params, function(err, data) {
        if (err) {
            console.log("Unable to delete item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("DeleteItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}
//helper methods
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}