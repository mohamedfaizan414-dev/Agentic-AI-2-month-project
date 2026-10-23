const transporter = require('./email.config')
const verifyEmail = require('../templates/email.verify')
const welcomeEmail = require('../templates/email.welcome')

async function verify(email,verificationCode){
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email, // list of recipients
    subject: "Verify your Email", 
    text: "Email Verification", 
    html: verifyEmail.replace('{otp}', verificationCode), // HTML body
  });
}

async function welcome(email,name){
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email, // list of recipients
    subject: "Welcome to Azentix!", 
    text: " Welcome to Azentix!", 
    html: welcomeEmail.replace('{name}', name), // HTML body
  });
}

module.exports = {verify,welcome}
