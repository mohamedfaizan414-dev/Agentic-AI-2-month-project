const express = require("express")
const authController = require("../controllers/auth.controller.js")
const auth = require("../middleware/auth.middleware")
const router = express.Router()


router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/me',auth,authController.getMe)
router.post('/verifyemail', authController.verifyEmail)

module.exports = router





