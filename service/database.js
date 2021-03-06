var DocumentClient = require('documentdb').DocumentClient,
  dbutils = require('./dbutils');

var host = process.env.DB_HOST;                     // Add your endpoint
var masterKey = process.env.DB_MASTER_KEY;  // Add the massterkey of the endpoint
var client = new DocumentClient(host, {masterKey: masterKey});

var databaseDefinition = "bahn";
var collectionDefinition = "connections";
var myCollection;

dbutils.getOrCreateDatabase(client, databaseDefinition, function (err, database) {
  dbutils.getOrCreateCollection(client, database._self, collectionDefinition, function(err, collection) {
      if(err) return console.log(err);
      console.log('created collection');
      myCollection = collection;
  });
});


function insert (documentDefinition) {
  client.createDocument(myCollection._self, documentDefinition, function(err, document) {
      if(err) return console.log(err);
      console.log('Created Document');
  });

}

function readCollection(callback) {
    client.readCollection(myCollection._self, function (err, coll) {
        if (err) {
            handleError(err);
            return;
        }

        callback(coll);

    });
}

function getItems (callback) {

        var querySpec = {
            query: 'SELECT * FROM ' + collectionDefinition + ' c'
        };

        client.queryDocuments(myCollection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
}

function getItemsBetweenTime(start, end, callback) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM ' + collectionDefinition + ' c WHERE c.start >= @start AND c["end"] <= @end',
            parameters: [{
              name: "@start",
              value: 1446761624034
            }, {
              name: "@end",
              value: 1446799945028
            }]
        };

        console.log("Query Spec:", querySpec);

        client.queryDocuments(myCollection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
}

function cleanup(client, database) {
    client.deleteDatabase(database._self, function(err) {
        if(err) console.log(err);
    });
}


module.exports = {
  insert: insert,
  cleanup: cleanup,
  readCollection: readCollection,
  getItems: getItems,
  getItemsBetweenTime: getItemsBetweenTime
};
