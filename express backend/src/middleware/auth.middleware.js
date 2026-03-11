
require('dotenv').config()  
const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")

module.exports = async function auth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if (!user) return res.status(401).json({ message: "Invalid token" })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Unauthorized"})
  }
}
