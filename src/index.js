require('./db/mongoose')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const doctorRouter = require('./routers/doctor')
const appointmentRouter = require('./routers/appointment')
var cookieParser = require('cookie-parser')
const methodOverride = require('method-override');

const app = express()
const port = process.env.PORT

// Define paths for Express config
const viewPath = path.join(__dirname, '../src/templates/views')
const partialsPath = path.join(__dirname, '../src/templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(methodOverride('_method'));
app.use(doctorRouter)
app.use(appointmentRouter)

app.get('', (req, res) => {
    res.render('Home', {
        title: 'Home',
        name: 'Stephen King'
    })
})

app.get('/Registration', (req, res) => {
    res.render('Registration', {
        title: 'Registration Form',
        name: 'Stephen King'
    })
})

app.get('/Login', (req, res) => {
    res.render('Login', {
        title: 'Login Form',
        name: 'Stephen King'
    })
})

app.get('/Edit', (req, res) => {
    res.render('Edit', {
        title: 'Edit Form',
        name: 'Stephen King'
    })
})

app.get('/CreateAppointment', (req, res) => {
    res.render('CreateAppointment', {
        title: 'Create Appointment',
        name: 'Stephen King'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        error: 'Error 404-Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
