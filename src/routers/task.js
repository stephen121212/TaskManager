const express = require('express')
const Task = require('../models/Task')
const router = new express.Router()

router.post('/Task', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/Task', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/Task/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/Task/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status.send({error : 'Invalid Operations'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/Task/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router