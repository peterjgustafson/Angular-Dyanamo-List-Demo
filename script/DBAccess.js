
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
    createDBTable();
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

function createItem() {
    var params = {
        TableName :"extensibleLists",
        Item: {
                "facebookId": myListObj.facebookId,
                "createDateTime": myListObj.createDateTime,
                "info": {
                            "currentUserName": myListObj.info.currentUserName,
                            "listName": myListObj.info.listName,
                            "items": JSON.stringify(myListObj.info.items)
                }
            }
    };
    console.log(JSON.stringify(myListObj));
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2)) + "\nObj: " + JSON.stringify(myListObj);
        } else {
            console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)) + "\n" + JSON.stringify(myListObj);
        }
    });
}
function scanData() {
    document.getElementById('textarea').innerHTML = "";
    document.getElementById('textarea').innerHTML += "Scanning for movies between 2005 and 2016." + "\n";

    var params = {
        TableName: "Movies",
        ProjectionExpression: "#yr, title, info.rating",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":start_yr": "2005",
            ":end_yr": "2016"
        }
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            document.getElementById('textarea').innerHTML += "Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
            // Print all the movies
            document.getElementById('textarea').innerHTML += "Scan succeeded: " + "\n";
            data.Items.forEach(function(movie) {
                if(typeof movie.info !== 'undefined')
                    document.getElementById('textarea').innerHTML += movie.year + ": " + movie.title + " - rating: " + movie.info.rating + "\n";
            else
                    document.getElementById('textarea').innerHTML += movie.year + ": " + movie.title + "\n";
            });

            // Continue scanning if we have more movies (per scan 1MB limitation)
            document.getElementById('textarea').innerHTML += "Scanning for more..." + "\n";
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);            
        }
    }
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
function getAllLists() {
    var params = {
        TableName : "extensibleLists", 
        KeyConditionExpression: "#fbid = :fbuserid",
        ExpressionAttributeNames:{
            "#fbid": "facebookId"
        },
        ExpressionAttributeValues: {
            ":fbuserid": myListObj.facebookId
        }
    };
    
    console.log(JSON.stringify(params));
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
           // myListObj.info.items = JSON.parse(data.Items[2].info.items);
            angular.element(document.getElementById('baseApp')).scope().getLists();
            /*data.Items.forEach(function(xList) {
                myLists.facebookId = xList.facebookId;
                myLists.createDateTime = xList.createDateTime;
                myLists.listName = xList.listName;
            });*/
            myLists = data;
            console.log(JSON.stringify(myLists));
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