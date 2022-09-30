// https://github.com/mongodb/node-mongodb-native
const { MongoClient,ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'eve';
let db = null
async function initDb(){
    await client.connect();
    console.log('Connected successfully to server');
    db=client.db(dbName);


    // 检查索引。
    db.collection('start_attendance').createIndex({attendanceId:1});
    db.collection('append_attendance').createIndex({attendanceId:1});
}
const initDbPromise = initDb()

function insert(collectionName,data) {
    return initDbPromise.then(()=>{
        const collection = db.collection(collectionName);
        collection.insertOne({...data,updatedTime:new Date()})
    })
}

function findOne(collectionName,query,options) {
    return initDbPromise.then(()=>{
        const collection = db.collection(collectionName);
        return collection.findOne(query,options)
    })
}

function find(collectionName,query,options) {
    return initDbPromise.then(()=>{
        const collection = db.collection(collectionName);
        return collection.find(query,options)
    })
}

function updateOne(collectionName,filter,data) {
    return initDbPromise.then(()=>{
        const collection = db.collection(collectionName);
        return collection.updateOne(filter,{$set:data})
    })
}

function updateMany(collectionName,filter,data) {
    return initDbPromise.then(()=>{
        const collection = db.collection(collectionName);
        return collection.updateMany(filter,{$set:data})
    })
}

function idToObjectId(id) {
    return ObjectId(id)
}





module.exports={
    insert,
    findOne,
    find,
    updateOne,
    updateMany,
    idToObjectId
}
