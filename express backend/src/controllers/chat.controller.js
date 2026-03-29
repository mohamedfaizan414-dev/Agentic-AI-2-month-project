const chatModel = require("../model/chat.model");
const tripModel = require("../model/trip.model");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const AI_BACKEND = process.env.AI_BACKEND_URL || "https://agent-backend-3s9n.onrender.com";

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const user = req.user;
    const activeId = conversationId || uuidv4();

    // Save user message
    await chatModel.create({
      user: user._id,
      conversationId: activeId,
      message,
      sender: "user",
      title: !conversationId ? message.substring(0, 50) : undefined,
    });

    // Call AI agent
    const aiRes = await axios.post(
      `${AI_BACKEND}/chat`,
      { conversation_id: activeId, message },
      { timeout: 90000 }  // 90s timeout for long AI responses
    );

    const {
      reply,
      stage,
      itinerary,
      destination,
      departure_date,
      return_date,
      budget,
      travelers,
    } = aiRes.data;

    // Save bot reply
    await chatModel.create({
      user: user._id,
      conversationId: activeId,
      message: reply,
      sender: "bot",
      metadata: { stage, destination, departure_date, return_date, budget, travelers },
    });

    // If itinerary was generated, save/update a Trip document
    if (itinerary && destination) {
      await tripModel.findOneAndUpdate(
        { user: user._id, conversationId: activeId },
        {
          user: user._id,
          conversationId: activeId,
          destination,
          departure_date,
          return_date,
          budget,
          travelers,
          itinerary,
          status: "planned",
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ reply, conversationId: activeId, stage });
  } catch (err) {
    console.error("[chat] sendMessage error:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({
      error: status >= 500 ? "AI service temporarily unavailable. Please try again." : err.message,
    });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await chatModel.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$conversationId",
          title: { $first: "$title" },
          lastUpdated: { $max: "$createdAt" },
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { lastUpdated: -1 } },
      { $limit: 30 },
    ]);
    res.status(200).json(sessions);
  } catch (err) {
    console.error("[chat] getSessions error:", err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const history = await chatModel
      .find({ user: req.user._id, conversationId: req.params.id })
      .sort({ createdAt: 1 })
      .select("-__v");
    res.status(200).json(history);
  } catch (err) {
    console.error("[chat] getChatHistory error:", err.message);
    res.status(500).json({ error: "Could not fetch history" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await chatModel.deleteMany({ user: req.user._id, conversationId: req.params.id });
    await tripModel.deleteMany({ user: req.user._id, conversationId: req.params.id });
    res.status(200).json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete session" });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await tripModel
      .find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-itinerary -__v");
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

exports.getTripItinerary = async (req, res) => {
  try {
    const trip = await tripModel.findOne({ user: req.user._id, _id: req.params.id });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

exports.rateTrip = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    const trip = await tripModel.findOneAndUpdate(
      { user: req.user._id, _id: req.params.id },
      { rating, review },
      { new: true }
    );
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.status(200).json({ message: "Rating saved", trip });
  } catch (err) {
    res.status(500).json({ error: "Failed to save rating" });
  }
};
