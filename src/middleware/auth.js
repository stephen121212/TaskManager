const jwt = require('jsonwebtoken')
const Doctor = require('../models/doctor')


const auth = async (req, res, next) => {
    try{
        const authHeader = req.cookies.Authorization
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const doctor = await Doctor.findOne({_id: decoded._id.toString(), 'tokens.token':token})

        if(!doctor){
            throw new Error()
        }

        req.token = token
        req.doctor = doctor
        next()

    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth