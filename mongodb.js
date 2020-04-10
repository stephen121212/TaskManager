//CRUD operations

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'TaskManager'

//Connect to the server (Asynchronous operation)
MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database')
    }

    //Database reference, to create a database
    const db = client.db(database)

    //Creating a collection of users and inserting user Andrew
    db.collection('users').insertOne({
        name:'Andrew',
        age: 27
    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user to database')
        }

        console.log(result.ops)
    })


    //Creating a collection of tasks and inserting three tasks
    db.collection('tasks').insertMany({
        description:'Washing Dishes',
        completed: true
    }, {
        description:'Iron Clothes',
        completed: true
    }, {
        description:'Hoovering',
        completed: false
    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user to database')
        }
        console.log(result.ops)
    })
})