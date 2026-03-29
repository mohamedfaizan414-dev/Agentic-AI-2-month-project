const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: "Username or email already taken" });

    const hash = await bcrypt.hash(password, 12);
    const user = await userModel.create({ username, email, password: hash });
    const token = signToken(user._id);
    res.status(201).json({ message: "Account created successfully", user: user.username, token });
  } catch (err) {
    console.error("[auth] register error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Update last seen
    await userModel.findByIdAndUpdate(user._id, { lastSeen: new Date() });

    const token = signToken(user._id);
    res.status(200).json({ message: "Logged in successfully", user: user.username, token });
  } catch (err) {
    console.error("[auth] login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updatePreferences(req, res) {
  try {
    const { currency, travelStyle, dietaryRestrictions, homeCity } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { preferences: { currency, travelStyle, dietaryRestrictions, homeCity } },
      { new: true }
    ).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update preferences" });
  }
}

module.exports = { registerUser, loginUser, getMe, updatePreferences };

