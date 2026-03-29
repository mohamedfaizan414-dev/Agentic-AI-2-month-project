const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const chatCtrl  = require("../controllers/chat.controller");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 20,
  message: { error: "Too many messages. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/chat",        auth, chatLimiter, chatCtrl.sendMessage);
router.get("/sessions",     auth, chatCtrl.getSessions);
router.get("/history/:id",  auth, chatCtrl.getChatHistory);
router.delete("/session/:id", auth, chatCtrl.deleteSession);
router.get("/trips",        auth, chatCtrl.getTrips);
router.get("/trips/:id",    auth, chatCtrl.getTripItinerary);
router.post("/trips/:id/rate", auth, chatCtrl.rateTrip);

module.exports = router;
