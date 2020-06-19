const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const validatePhoneNumber = require('validate-phone-number-node-js');

const doctorSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }, 
    phoneNumber: {
        unique: true,
        type: String,
        required: true,
        isPhoneNumberValid(value){
            const result = validatePhoneNumber.validate(value);
            if(!result){
                throw new Error('Phone Number is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }], 
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

doctorSchema.methods.generateAuthToken = async function () {
    const doctor = this
    const token = jwt.sign({ _id: doctor._id.toString() }, process.env.JWT_SECRET)

    doctor.tokens = doctor.tokens.concat({ token })
    await doctor.save()

    return token
}

doctorSchema.statics.findByCredentials = async (email, password) => {
    const doctor = await Doctor.findOne({email})

    if(!doctor){
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }
    
    return doctor
}

doctorSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'doctor'
})

doctorSchema.methods.toJSON = function () {
    const doctor = this
    const doctorObject = doctor.toObject()

    delete doctorObject.password
    delete doctorObject.tokens
    delete doctorObject.avatar

    return doctorObject
}

//Hash Plain Text Password
doctorSchema.pre('save', async function (next) {
    const doctor = this

    if(doctor.isModified('password')){
        doctor.password = await bcrypt.hash(doctor.password, 8)
    }

    next()
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor