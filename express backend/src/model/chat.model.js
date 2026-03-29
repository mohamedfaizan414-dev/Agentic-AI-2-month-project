const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    conversationId: { type: String, required: true, index: true },
    title: { type: String, default: "New Adventure" },
    message: { type: String, required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    metadata: {
      stage: String,
      destination: String,
      departure_date: String,
      return_date: String,
      budget: Number,
      travelers: Number,
    },
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, conversationId: 1 });
module.exports = mongoose.model("chat", chatSchema);
