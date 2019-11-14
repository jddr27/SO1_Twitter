const MongoClient = require('mongodb').MongoClient;

const IP = process.env.DB || "localhost";
// Connection URL 
const url = `mongodb://admin:admin@${IP}:27017`;
 
// Database Name
const DB_NAME = 'sopes1proyecto';

const COLLECTION_NAME = 'tweets';
 

const MONGODB = {

    insert: function(document) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
            if (err) throw err;
            console.log("Connected successfully to server");
        
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            collection.insertOne(document, function(err, result) {

                if (err) throw err;
                console.log("tweet guardado en database;");
                client.close();
            });
        });
    },

    delete: function(callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
            if (err) throw err;
            console.log("Connected successfully to server");
        
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            collection.remove({});
        });
    }
}


module.exports = MONGODB;