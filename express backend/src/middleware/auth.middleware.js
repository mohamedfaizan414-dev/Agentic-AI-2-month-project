
const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")

module.exports = async function auth(req, res, next) {
  try {
    // ✅ get token from header instead of cookies
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    if (!user) return res.status(401).json({ message: "Invalid token" })

    req.user = user
    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "hii",err })
  }
}