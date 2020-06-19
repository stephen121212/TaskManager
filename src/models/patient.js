const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const validatePhoneNumber = require('validate-phone-number-node-js');

const patientSchema = new mongoose.Schema({
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
        type: Number,
        required: true,
        isPhoneNumberValid(value){
            const result = validatePhoneNumber.validate(value);
            if(!result){
                throw new Error('Phone Number is invalid')
            }
        }
    },

    address: {
        type: String,
        required: true
    }, 

    currentPrescribedMedication: {
        type: String,
        required: true
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

patientSchema.virtual('Appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'patient'
})

patientSchema.virtual('ProbabilityOfMissedAppointments', {
    ref: 'ProbablitityofMissedAppointment',
    localField: '_id',
    foreignField: 'patient'
})

patientSchema.methods.generateAuthToken = async function () {
    const patient = this
    const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)

    patient.tokens = patient.tokens.concat({ token })
    await patient.save()

    return token
}

patientSchema.statics.findByCredentials = async (email, password) => {
    const patient = await Patient.findOne({email})

    if(!patient){
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, patient.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }
    
    return patient
}

patientSchema.methods.toJSON = function () {
    const patient = this
    const patientObject = patient.toObject()

    delete patientObject.password
    delete patientObject.tokens
    delete patientObject.avatar

    return patientObject
}

//Hash Plain Text Password
patientSchema.pre('save', async function (next) {
    const patient = this

    if(patient.isModified('password')){
        patient.password = await bcrypt.hash(patient.password, 8)
    }

    next()
})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient