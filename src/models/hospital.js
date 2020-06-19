const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
    hospital_name: {
        type: String,
        required: true,
        trim: true
    },
    contact_Information: {
        unique: true,
        type: String,
        required: true,
        trim: true
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }], 
}, {
    timestamps: true
})

const Hospital = mongoose.model('Hospital', hospitalSchema)

module.exports = Hospital