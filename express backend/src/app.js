const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes.js")
const chatRoutes = require("./routes/chat.routes.js")
app = express()
app.use(cookieparser())
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())


app.use('/api',chatRoutes)


app.use('/api/auth',authRoutes)

module.exports = app