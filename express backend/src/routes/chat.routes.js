const express = require("express")
const chatController = require("../controllers/chat.controller.js")
const router = express.Router()
const auth = require("../middleware/auth.middleware")

router.post('/chat', auth, chatController.sendMessage)

router.get('/history/:id', auth, chatController.getChatHistory)

router.get('/sessions', auth, chatController.getSessions)

module.exports = router