const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'minechart1@gmail.com', 
    pass: 'Kipper10.' 
  }
})

const sendWelcomeEmail = (email, name) => {
  let mailOptions = {
    to:email,
    from: 'minechart1@gmail.com',
    subject: 'Thanks for joining in',
    text: 'Welcome to the app, ' + name + '. Let me know how to get along with the app.'
  }

  transporter.sendMail(mailOptions, function (err, data){
    if(err){
      console.log('Error Occurs')
    } else {
      console.log('Email Sent')
    }
  })
}

const sendCancellationEmail = (email, name) => {
  let mailOptions = {
    to:email,
    from: 'minechart1@gmail.com',
    subject: 'Sorry to hear you are gone',
    text: 'Hello, ' + name + '. Would you like to give us information on why you left our services?'
  }

  transporter.sendMail(mailOptions, function (err, data){
    if(err){
      console.log('Error Occurs')
    } else {
      console.log('Email Sent')
    }
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}