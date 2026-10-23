const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../model/user.model.js');
const { verify, welcome } = require('../middleware/email.js');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const verificationCode = () => crypto.randomInt(100000, 1000000).toString();

async function registerUser(req, res, next) {
  try {
    const username = String(req.body.username || '').trim(); const email = normalizeEmail(req.body.email); const password = String(req.body.password || '');
    if (username.length < 3 || username.length > 40 || !/^\S+$/.test(username)) return res.status(400).json({ message: 'Username must be 3–40 characters with no spaces.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (await userModel.exists({ $or: [{ username }, { email }] })) return res.status(409).json({ message: 'An account with that username or email already exists.' });
    const code = verificationCode();
    const user = await userModel.create({ username, email, password: await bcrypt.hash(password, 12), verficationCode: code, verificationCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    try { await verify(user.email, code); } catch (error) { console.error('Verification email failed', error.message); }
    return res.status(201).json({ message: 'Account created. Check your email for the verification code.', email: user.email });
  } catch (error) { return next(error); }
}
async function verifyEmail(req, res, next) { try { const email = normalizeEmail(req.body.email); const otp = String(req.body.otp || ''); const user = await userModel.findOne({ email, verficationCode: otp, verificationCodeExpiresAt: { $gt: new Date() } }); if (!user) return res.status(400).json({ message: 'That code is invalid or has expired.' }); user.isVerified = true; user.verficationCode = undefined; user.verificationCodeExpiresAt = undefined; await user.save(); welcome(user.email, user.username).catch((error) => console.error('Welcome email failed', error.message)); return res.json({ message: 'Email verified. You can now sign in.' }); } catch (error) { return next(error); } }
async function loginUser(req, res, next) { try { const identifier = String(req.body.username || req.body.email || '').trim(); const password = String(req.body.password || ''); const user = await userModel.findOne({ $or: [{ username: identifier }, { email: normalizeEmail(identifier) }] }); if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Incorrect email or password.' }); if (!user.isVerified) return res.status(403).json({ message: 'Verify your email before signing in.' }); return res.json({ message: 'Signed in successfully.', user: user.username, token: signToken(user) }); } catch (error) { return next(error); } }
async function getMe(req, res) { return res.json(req.user); }
module.exports = { registerUser, loginUser, getMe, verifyEmail };
