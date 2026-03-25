
const chatModel = require("../model/chat.model");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const user = req.user;
    
    // If no conversationId is sent, this is a "New Chat" -> create a new UUID
    const activeId = conversationId || uuidv4();

    // Save User Message
    await chatModel.create({
      user: user._id,
      conversationId: activeId,
      message: message,
      sender: "user",
      // Only set the title if it's the very first message of a new session
      title: !conversationId ? (message.substring(0, 30) + "...") : undefined 
    });

    const aiResponse = await axios.post("https://agentic-ai-ycsg.onrender.com/chat", {
        conversation_id: activeId,
        message: message
    });

    const botReply = aiResponse.data.reply;

    // Save Bot Reply
    await chatModel.create({
      user: user._id,
      conversationId: activeId,
      message: botReply,
      sender: "bot"
    });

    // Return the activeId so the frontend knows which session it is in
    res.status(200).json({ reply: botReply, conversationId: activeId });
  } catch (error) {
    res.status(500).json({ error: "Chat failed" });
  }
};

exports.getSessions = async (req, res) => {
  try {
    // This groups messages by conversationId so the sidebar shows unique chats
    const sessions = await chatModel.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { createdAt: 1 } }, 
      { $group: { 
          _id: "$conversationId", 
          title: { $first: "$title" }, 
          lastUpdated: { $max: "$createdAt" } 
      }},
      { $sort: { lastUpdated: -1 } }
    ]);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

exports.getChatHistory = async (req, res) => {
    try {
        // CRITICAL: Filter by BOTH user and the specific conversationId
        const history = await chatModel.find({ 
            user: req.user._id, 
            conversationId: req.params.id 
        }).sort({ createdAt: 1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
};