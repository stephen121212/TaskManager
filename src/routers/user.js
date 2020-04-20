const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

router.post('/User', async (req, res) => {
  
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/User/Login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/User/Logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/User/LogoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    dest: 'avatar',
    limits: {
        fileSize: 100000
    }, 
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a JPG, JPEG & PNG document'))
        }

        cb(undefined, true)
    }
})

router.post('/User/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})


router.get('/User/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/User', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/User/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status.send({error : 'Invalid Operations'})
    }

    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/User/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router