const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Doctor'
    }, 
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Patient'
    }
}, {
    timestamps:true
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment