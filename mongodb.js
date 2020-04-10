//CRUD operations

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'TaskManager'
const id = new ObjectID()
console.log(id)

//Connect to the server (Asynchronous operation)
MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database')
    }

    //Database reference, to create a database
    const db = client.db(database)

    //Creating a collection of users and inserting user Andrew
    //db.collection('users').insertOne({
    //   name:'Andrew',
    //    age: 27
    //}, (error, result) => {
    //    if(error){
    //        return console.log('Unable to insert user to database')
    //    }
    //    console.log(result.ops)
    //})


    //Creating a collection of tasks and inserting three tasks
    //db.collection('tasks').insertMany([{
    //    description:'Washing Dishes',
    //    completed: true
    //}, {
    //    description:'Iron Clothes',
    //    completed: true
    //}, {
    //   description:'Hoovering',
    //   completed: false
    //}], (error, result) => {
    //    if(error){
    //        return console.log('Unable to insert user to database')
    //    }
    //    console.log(result.ops)
    //})

    //Quering the database printing users by ID
    //db.collection('users').findOne({_id: new ObjectID("5e90877e0b685509440bb3a2") }, (error, user) => {
    //    if(error){
    //        return console.log('Unable to fetch')
    //    }
    //
    //    console.log(user)
    //})

    //Quering the database to print users with Object Property
    //db.collection('users').find({age:27}).toArray((error, users) => {
    //    console.log(users)
    //})

    //Quering the database to count the users with Object Property
    //db.collection('users').find({age:27}).count((error, count) => {
    //    console.log(count)
    //})

    //Quering the database printing tasks by ID
    //db.collection('tasks').findOne({_id: new ObjectID("5e90ac2591c6533d30e9792f")}, (error, tasks) =>{
    //    if(error){
    //        return console.log('Unable to fetch')
    //    }
    //    console.log(tasks)
    //})

    //Quering the database to print tasks if not completed
    //db.collection('tasks').find({completed:false}).toArray((error, tasks) => {
    //    if(error){
    //        return console.log('Unable to fetch')
    //    }
    //    console.log(tasks)
    //})

    //Update one user with Promise
    //const updatePromise = db.collection('users').updateOne({
    //    _id: new ObjectID("5e90877e0b685509440bb3a2")
    //}, {
    //    $set: {
    //    name:"Mike"
    //    }
    //})

    //updatePromise.then((result) =>{
    //    console.log(result)
    //}).catch((error) => {
    //    console.log(error)
    //})

    //Update tasks with completed as false to completed with true
    //db.collection('tasks').updateMany({
    //    completed:false
    //}, {
    //    $set: {
    //        completed:true
    //    }
    //}).then((result) => {
    //    console.log(result)
    //}).catch((error) => {
    //    console.log(error)
    //})

    //Delete One Task by description
    //db.collection('tasks').deleteOne({
    //    description: 'Hoovering'
    //}).then((result) => {
    //    console.log(result)
    //}).catch((error) => {
    //    console.log(error)
    //})

    //Delete Many for Users
    //db.collection('users').deleteMany({
    //    age: 27
    //}).then((result) => {
    //    console.log(result)
    //}).catch((error) => {
    //    console.log(error)
    //})
})