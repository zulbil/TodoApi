//const MongoClient   = require('mongodb').MongoClient; 
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID(); 
console.log(obj); 
const uriDB         = 'mongodb://localhost:27017/todoDB';

MongoClient.connect(uriDB, {useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB Server");
    }
    console.log("Connected to the server"); 
    /* Insert a new data on Users collections */
    // client.db('todoDB').collection('Users').insertOne({
    //     name: "Alexandre", 
    //     age: 26, 
    //     location: "Sousse, Tunisie"
    // }, (err, result) => {
    //     if (err) { return console.log("Cannot insert to the database"); }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // }); 

    /* Find data */
    client.db('todoDB').collection('Users').find({name: 'Mike'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        throw new Error('Unable to load data');
    })

    client.close();
})