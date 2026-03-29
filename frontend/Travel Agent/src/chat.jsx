import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './message.jsx';
import './App.css';

const PROMPT_CHIPS = [
  { icon: '🗺', title: 'Build an itinerary', desc: '7 days in Japan, culture & food focus' },
  { icon: '💰', title: 'Budget breakdown', desc: 'Solo Europe trip on $2,000' },
  { icon: '🏝', title: 'Hidden gems', desc: 'Off-the-beaten-path Southeast Asia' },
  { icon: '✈️', title: 'Flight + Visa help', desc: 'Indian passport to Europe' },
  { icon: '🌤', title: 'Weather check', desc: "What's the weather like in Bali in July?" },
  { icon: '🎒', title: 'Packing list', desc: '2 weeks in cold Iceland + hiking' },
];

const BackendUrl = 'https://express-backend-quh7.onrender.com';

const ChatPage = () => {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [sessions, setSessions]     = useState([]);
  const [activeId, setActiveId]     = useState(null);
  const [user, setUser]             = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stage, setStage]           = useState('active');
  const [itineraryReady, setItineraryReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError]           = useState('');

  const scrollRef  = useRef(null);
  const inputRef   = useRef(null);
  const navigate   = useNavigate();
  const token      = localStorage.getItem('token');

  // ── init ──────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await axios.get(`${BackendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        await refreshSessions();
      } catch {
        navigate('/login');
      }
    };
    init();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when session starts
  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  // ── session helpers ───────────────────────────────────────────────
  const refreshSessions = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch {
      // non-critical
    }
  };

  const loadChat = async (sessionId) => {
    setMessages([]);
    setActiveId(sessionId);
    setLoading(true);
    setItineraryReady(false);
    setError('');
    try {
      const res = await axios.get(`${BackendUrl}/api/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      // check if this session had a completed itinerary
      const last = res.data[res.data.length - 1];
      if (last?.metadata?.stage === 'done') setItineraryReady(true);
    } catch {
      setError('Failed to load conversation.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await axios.delete(`${BackendUrl}/api/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (activeId === sessionId) {
        setActiveId(null);
        setMessages([]);
        setItineraryReady(false);
      }
      await refreshSessions();
    } catch {
      // silent
    }
  };

  // ── send message ──────────────────────────────────────────────────
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { message: text, sender: 'user', _id: Date.now() }]);
    setInput('');
    setLoading(true);
    setError('');
    setItineraryReady(false);

    try {
      const res = await axios.post(
        `${BackendUrl}/api/chat`,
        { message: text, conversationId: activeId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      );

      const { reply, conversationId, stage: newStage } = res.data;

      setMessages(prev => [...prev, { message: reply, sender: 'bot', _id: Date.now() + 1 }]);
      setStage(newStage || 'active');
      if (newStage === 'done') setItineraryReady(true);

      if (!activeId) {
        setActiveId(conversationId);
        await refreshSessions();
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
      setMessages(prev => prev.slice(0, -1)); // remove optimistic user message
    } finally {
      setLoading(false);
    }
  }, [input, loading, activeId, token]);

  // keyboard shortcut: Ctrl+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChip = (chip) => {
    setInput(chip.desc);
    inputRef.current?.focus();
  };

  const startNewChat = () => {
    setActiveId(null);
    setMessages([]);
    setItineraryReady(false);
    setError('');
    setStage('active');
    inputRef.current?.focus();
  };

  // copy itinerary to clipboard
  const copyItinerary = () => {
    const lastBot = [...messages].reverse().find(m => m.sender === 'bot');
    if (lastBot) {
      navigator.clipboard.writeText(lastBot.message);
    }
  };

  const filteredSessions = sessions.filter(s =>
    !searchQuery || (s.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userInitial = user?.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="app-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">Travel<span>AI</span></div>

        <button className="btn-new-chat" onClick={startNewChat}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Conversation
        </button>

        {/* search */}
        <div className="sidebar-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search chats…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="history-label">Recent</div>
        <div className="history-wrapper">
          {filteredSessions.length === 0 && (
            <p className="sidebar-empty">No conversations yet</p>
          )}
          {filteredSessions.map(s => (
            <div
              key={s._id}
              onClick={() => loadChat(s._id)}
              className={`history-item ${activeId === s._id ? 'active' : ''}`}
            >
              <span className="history-title">{s.title || 'Travel Plan'}</span>
              <button
                className="history-delete"
                onClick={(e) => deleteSession(s._id, e)}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="profile-pill" onClick={() => setShowProfile(!showProfile)}>
            <div className="avatar">{userInitial}</div>
            <div className="profile-info">
              <span className="name">{user?.username}</span>
              <span className="badge">✦ Member</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: 0.4 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {showProfile && (
            <div className="profile-popover">
              <div className="popover-user">
                <strong>{user?.username}</strong>
                <span>{user?.email}</span>
              </div>
              <button
                className="btn-signout"
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="content-container">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="topbar-title">Travel Concierge</span>

          {/* topbar actions */}
          <div className="topbar-actions">
            {stage === 'done' && (
              <div className="stage-badge done">✓ Itinerary Ready</div>
            )}
            {stage === 'active' && messages.length > 0 && (
              <div className="stage-badge planning">⚡ Planning</div>
            )}
            {itineraryReady && (
              <button className="btn-copy-itinerary" onClick={copyItinerary} title="Copy itinerary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy Itinerary
              </button>
            )}
          </div>
        </div>

        <div className="chat-scroller">
          <div className="chat-max-width">

            {/* welcome screen */}
            {messages.length === 0 && !loading && (
              <div className="welcome-hero">
                <div className="welcome-orb" />
                <h1>Where to next, <span>{user?.username || 'explorer'}</span>?</h1>
                <p>Your personal AI travel concierge — real-time prices, live weather, curated itineraries.</p>
                <div className="welcome-prompts">
                  {PROMPT_CHIPS.map((chip, i) => (
                    <button key={i} className="prompt-chip" onClick={() => handleChip(chip)}>
                      <span className="chip-icon">{chip.icon}</span>
                      <strong>{chip.title}</strong>
                      <span className="chip-desc">{chip.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* messages */}
            {messages.map((m, i) => (
              <div key={m._id || i} className={`message-row ${m.sender}`}>
                {m.sender === 'bot' && (
                  <div className="bot-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                )}
                {m.sender === 'user'
                  ? <div className="user-bubble">{m.message}</div>
                  : <ChatMessage role={m.sender} content={m.message} />
                }
              </div>
            ))}

            {/* loading indicator */}
            {loading && (
              <div className="message-row bot">
                <div className="bot-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <div className="bubble thinking">
                  <span className="thinking-label">ARIA is researching</span>
                  <div className="dots"><span /><span /><span /></div>
                </div>
              </div>
            )}

            {/* error */}
            {error && (
              <div className="error-banner">
                ⚠️ {error}
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </div>

        {/* input */}
        <div className="input-section">
          <div className="chat-max-width">
            <form className="input-box" onSubmit={handleSend}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about destinations, budgets, itineraries…"
                rows={1}
                disabled={loading}
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
            <p className="input-hint">
              Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line · TravelAI can make mistakes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
