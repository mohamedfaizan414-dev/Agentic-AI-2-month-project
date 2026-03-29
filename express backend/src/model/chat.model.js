const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  // ADDED: conversationId to group messages
  conversationId: { type: String, required: true }, 
  // ADDED: title for the sidebar
  title: { type: String, default: "New Adventure" }, 
  message: { type: String, required: true },
  sender: { type: String, enum: ["user", "bot"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("chat", chatSchema);