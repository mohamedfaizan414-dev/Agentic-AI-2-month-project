const mongoose2 = require("mongoose");

const tripSchema = new mongoose2.Schema(
  {
    user: { type: mongoose2.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    conversationId: { type: String, required: true },
    destination: { type: String, required: true },
    departure_date: String,
    return_date: String,
    budget: Number,
    budget_currency: { type: String, default: "INR" },
    travelers: Number,
    trip_purpose: String,
    itinerary: { type: String },  // full markdown itinerary
    status: { type: String, enum: ["planning", "planned", "ongoing", "completed"], default: "planning" },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    tags: [String],
    coverImageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose2.model("trip", tripSchema);
