const verifyEmail = require('../templates/email.verify');
const welcomeEmail = require('../templates/email.welcome');

async function sendWithResend({ to, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM || process.env.SMTP_FROM, to: [to], subject, text, html }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email API rejected the request (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json();
}

async function sendEmail(payload) {
  if (process.env.RESEND_API_KEY) return sendWithResend(payload);
  const transporter = require('./email.config');
  return transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: payload.to, subject: payload.subject, text: payload.text, html: payload.html });
}

function verify(email, verificationCode) {
  return sendEmail({ to: email, subject: 'Your Atlas verification code', text: `Your Atlas verification code is ${verificationCode}. It expires in 10 minutes.`, html: verifyEmail.replace('{otp}', verificationCode) });
}

function welcome(email, name) {
  return sendEmail({ to: email, subject: 'Welcome to Atlas', text: `Welcome to Atlas, ${name}. Your travel desk is ready.`, html: welcomeEmail.replace('{name}', name) });
}

module.exports = { verify, welcome };
