const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
const chatRoutes = require('./routes/chat.routes.js');

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,https://travelagent-ten.vercel.app').split(',').map((origin) => origin.trim());
app.set('trust proxy', 1);
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error('Origin not allowed')); }, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'], maxAge: 86400 }));
app.use(cookieParser());
app.use(express.json({ limit: '32kb' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => { console.error(error); res.status(error.status || 500).json({ message: error.status ? error.message : 'Something went wrong. Please try again.' }); });
module.exports = app;
