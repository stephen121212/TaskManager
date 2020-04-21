// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

//API Key Send Grid
//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
const sgMail = require('@sendgrid/mail');
SendGridAPIKey = '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'
sgMail.setApiKey(SendGridAPIKey);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg), function(err, json) {
    if(err){
        return 'AAHHHHHH!'
    }
}