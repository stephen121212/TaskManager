const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Doctor = require('../models/doctor')
const auth = require('../middleware/auth')
const email = require('../Emails/account')
const router = new express.Router()
const bodyParser = require('body-parser')
const urlencodedParser=bodyParser.urlencoded({extended: false})

router.post('/Doctor', urlencodedParser, async (req, res) => {
    const doctor = new Doctor(req.body)

    try {
        await doctor.save()
        email.sendWelcomeEmail(doctor.email, doctor.name)
        res.render('Login')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/Doctor/Login', urlencodedParser, async (req, res) => {
    try {
        const doctor = await Doctor.findByCredentials(req.body.email, req.body.password)
        const token = await doctor.generateAuthToken()
        
        res.cookie('Authorization', 'Bearer ' + token, {
            maxAge: 900000, 
            httpOnly: true
        })

        res.render('Profile', {data:doctor})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/Doctor/Logout', urlencodedParser, auth, async (req, res) => {
    try {
        req.doctor.tokens = req.doctor.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.doctor.save()
        res.redirect('/Login')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/Doctor/me', auth, async (req, res) => {
    res.render('Profile', {data:req.doctor})
})

router.get('/Doctor/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const doctor = await Doctor.findOne({ _id })

        if (!doctor) {
            return res.status(404).send()
        }

        res.send(doctor)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/Doctor/Update', urlencodedParser, auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['first_name', 'last_name', 'email', 'phoneNumber']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.doctor[update] = req.body[update])
        await req.doctor.save()
        res.redirect('/Doctor/me')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/Doctor/Delete', auth, async (req, res) => {
    try {
        await req.doctor.remove()
        email.sendCancellationEmail(req.doctor.email, req.doctor.name)
        res.redirect('/Login')
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/Doctor/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.doctor.avatar = buffer
    await req.doctor.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/Doctor/me/avatar', auth, async (req, res) => {
    req.doctor.avatar = undefined
    await req.doctor.save()
    res.send()
})

router.get('/Doctor/:id/avatar', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)

        if (!doctor || !doctor.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(doctor.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router