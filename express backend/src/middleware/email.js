const transporter = require('./email.config')
const verifyEmail = require('../templates/email.verify')
const welcomeEmail = require('../templates/email.welcome')

async function verify(email,verificationCode){
try {
  const info = await transporter.sendMail({
    from: '"Azentix" <azentixtravelagent@gmail.com>', // sender address
    to: email, // list of recipients
    subject: "Verify your Email", 
    text: "Email Verification", 
    html: verifyEmail.replace('{{otp}}', verificationCode), // HTML body
  });

  console.log("Message sent");

} catch (err) {
  console.error("Error while sending mail:", err);
}}

async function welcome(email,name){
try {
  const info = await transporter.sendMail({
    from: '"Azentix" <azentixtravelagent@gmail.com>', // sender address
    to: email, // list of recipients
    subject: "Welcome to Azentix!", 
    text: " Welcome to Azentix!", 
    html: welcomeEmail.replace('{{name}}', name), // HTML body
  });

  console.log("Message sent");

} catch (err) {
  console.error("Error while sending mail:", err);
}}

module.exports = {verify,welcome}