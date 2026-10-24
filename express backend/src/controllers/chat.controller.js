const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const chatModel = require('../model/chat.model');

const aiClient = axios.create({ baseURL: process.env.AI_SERVICE_URL || 'https://agentic-ai-ycsg.onrender.com', timeout: Number(process.env.AI_TIMEOUT_MS || 30000), headers: { 'Content-Type': 'application/json' } });
const cleanMessage = (value) => String(value || '').trim();

exports.sendMessage = async (req, res, next) => {
  try {
    const message = cleanMessage(req.body.message); const requestedId = cleanMessage(req.body.conversationId);
    if (!message || message.length > 2000) return res.status(400).json({ message: 'Messages must contain 1–2,000 characters.' });
    const conversationId = requestedId || uuidv4(); const title = requestedId ? undefined : `${message.slice(0, 48)}${message.length > 48 ? '…' : ''}`;
    await chatModel.create({ user: req.user._id, conversationId, message, sender: 'user', title });
    const context = await chatModel.find({ user: req.user._id, conversationId }).sort({ createdAt: -1 }).limit(12).select('message sender -_id').lean();
    context.reverse();
    // The current message is sent separately below; excluding it from history avoids
    // making the AI process the same text twice on every request.
    const priorTurns = context.slice(0, -1);
    let response;
    try { response = await aiClient.post('/chat', { conversation_id: conversationId, message, history: priorTurns.map((turn) => ({ role: turn.sender === 'bot' ? 'assistant' : 'user', content: turn.message })) }); }
    catch (error) { console.error('AI upstream error:', error.code || error.response?.status); return res.status(503).json({ message: 'Our travel concierge is temporarily unavailable. Please try again shortly.' }); }
    const reply = cleanMessage(response.data?.reply);
    if (!reply) return res.status(502).json({ message: 'The concierge returned an empty response. Please try again.' });
    await chatModel.create({ user: req.user._id, conversationId, message: reply, sender: 'bot' });
    return res.json({ reply, conversationId, stage: response.data.stage, itinerary: response.data.itinerary });
  } catch (error) { return next(error); }
};
exports.getSessions = async (req, res, next) => { try { const sessions = await chatModel.aggregate([{ $match: { user: req.user._id } }, { $sort: { createdAt: 1 } }, { $group: { _id: '$conversationId', title: { $first: '$title' }, lastUpdated: { $max: '$createdAt' } } }, { $sort: { lastUpdated: -1 } }, { $limit: 50 }]); return res.json(sessions); } catch (error) { return next(error); } };
exports.getChatHistory = async (req, res, next) => { try { const history = await chatModel.find({ user: req.user._id, conversationId: req.params.id }).sort({ createdAt: 1 }).select('message sender createdAt'); return res.json(history); } catch (error) { return next(error); } };
