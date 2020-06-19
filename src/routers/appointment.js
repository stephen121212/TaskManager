const express = require('express')
const Appointment = require('../models/appointment')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/Appointment', auth, async (req, res) => {
    const appointment = new Appointment({
        ...req.body,
        owner: req.doctor._id
    })

    try {
        await appointment.save()
        res.status(201).send(appointment)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/Appointment', auth, async (req, res) => {
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.doctor.populate({
            path: 'appointments',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.limit),
                sort
            }
        }).execPopulate()
        
        res.send(req.doctor.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/Appointment/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const appointment = await Appointment.findOne({ _id, owner: req.doctor._id })

        if (!appointment) {
            return res.status(404).send()
        }

        res.send(appointment)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/Appointment/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const appointment = await Appointment.findOne({ _id: req.params.id, owner: req.doctor._id})

        if (!appointment) {
            return res.status(404).send()
        }

        updates.forEach((update) => appointment[update] = req.body[update])
        await appointment.save()
        res.send(appointment)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/Appointment/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, owner: req.doctor._id })

        if (!appointment) {
            res.status(404).send()
        }

        res.send(appointment)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router