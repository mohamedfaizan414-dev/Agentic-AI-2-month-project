const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")

module.exports = async function auth(req, res, next) {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const decoded = jwt.verify(token, "e07339486a92b162db097ce1b5515f04")
    const user = await userModel.findById(decoded.id)

    if (!user) return res.status(401).json({ message: "Invalid token" })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message })
    console.error("Auth error:", err)
  }
}
