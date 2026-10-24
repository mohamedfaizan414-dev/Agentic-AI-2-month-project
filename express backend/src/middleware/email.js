const verifyEmail = require('../templates/email.verify');
const welcomeEmail = require('../templates/email.welcome');

function deliveryError(provider, status, detail) {
  const error = new Error(`${provider} rejected the email request (${status}): ${detail.slice(0, 300)}`);
  error.status = 503;
  error.publicMessage = status === 401
    ? 'Email delivery is temporarily unavailable. Please try again in a moment.'
    : 'We could not send that email right now. Please try again shortly.';
  return error;
}

async function sendWithBrevo({ to, subject, text, html }) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error('BREVO_SENDER_EMAIL is required when using Brevo. Add the email address you verified in Brevo.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || 'Atlas' },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw deliveryError('Brevo', response.status, detail);
  }
  return response.json();
}

async function sendWithResend({ to, subject, text, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM || process.env.SMTP_FROM, to: [to], subject, text, html }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw deliveryError('Email API', response.status, detail);
  }
  return response.json();
}

async function sendEmail(payload) {
  if (process.env.BREVO_API_KEY) return sendWithBrevo(payload);
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
