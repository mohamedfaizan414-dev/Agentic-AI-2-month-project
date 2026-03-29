const mongoose3 = require("mongoose");

const userSchema = new mongoose3.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    preferences: {
      currency: { type: String, default: "INR" },
      travelStyle: { type: String, enum: ["budget", "mid-range", "luxury"], default: "mid-range" },
      dietaryRestrictions: [String],
      homeCity: String,
    },
    lastSeen: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose3.model("user", userSchema);
