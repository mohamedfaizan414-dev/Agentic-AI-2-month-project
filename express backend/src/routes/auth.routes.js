const express2 = require("express");
const router2  = express2.Router();
const auth2    = require("../middleware/auth");
const rateLimit2 = require("express-rate-limit");
const { registerUser, loginUser, getMe, updatePreferences } = require("../controllers/auth.controller");

const authLimiter = rateLimit2({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  message: { error: "Too many auth attempts. Please try again in 15 minutes." },
});

router2.post("/register", authLimiter, registerUser);
router2.post("/login",    authLimiter, loginUser);
router2.get("/me",        auth2, getMe);
router2.patch("/preferences", auth2, updatePreferences);

module.exports = router2;
