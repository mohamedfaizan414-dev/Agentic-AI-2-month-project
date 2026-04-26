import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './message.jsx';
import './App.css';

const PROMPT_CHIPS = [
    { title: '🗺 Build an itinerary', desc: '7 days in Japan, culture & food focus' },
    { title: '💰 Budget breakdown', desc: 'Solo trip to Europe on $2,000' },
    { title: '🏝 Hidden gems', desc: 'Off-the-beaten-path spots in Southeast Asia' },
    { title: '✈️ Visa help', desc: 'Requirements for Indian passport holders' },
];

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const BackendUrl = 'https://express-backend-quh7.onrender.com';
    const token = localStorage.getItem("token");

    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await axios.get(`${BackendUrl}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userRes.data);
                try {
                    const sessRes = await axios.get(`${BackendUrl}/api/sessions`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSessions(sessRes.data);
                } catch (e) {
                    console.warn("Sessions failed to load.");
                }
            } catch (err) {
                navigate('/login');
            }
        };
        init();
    }, [navigate, token]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const loadChat = async (sessionId) => {
        setMessages([]);
        setActiveId(sessionId);
        setLoading(true);
        try {
            const res = await axios.get(`${BackendUrl}/api/history/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Session load failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;
        const text = input;
        setMessages(prev => [...prev, { message: text, sender: 'user' }]);
        setInput('');
        setLoading(true);
        try {
            const res = await axios.post(
                `${BackendUrl}/api/chat`,
                { message: text, conversationId: activeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, { message: res.data.reply, sender: 'bot' }]);
            if (!activeId) {
                setActiveId(res.data.conversationId);
                const sessRes = await axios.get(`${BackendUrl}/api/sessions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSessions(sessRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChip = (chip) => {
        setInput(chip.desc);
    };

    return (
        <div className="app-layout">

            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-logo">Azent<span>tix</span></div>

                <button
                    className="btn-new-chat"
                    onClick={() => { setActiveId(null); setMessages([]); }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New Conversation
                </button>

                <div className="history-label">Recent</div>
                <div className="history-wrapper">
                    {sessions.map(s => (
                        <div
                            key={s._id}
                            onClick={() => loadChat(s._id)}
                            className={`history-item ${activeId === s._id ? 'active' : ''}`}
                        >
                            {s.title || 'Travel Plan'}
                        </div>
                    ))}
                </div>

                <div className="sidebar-bottom">
                    <div className="profile-pill" onClick={() => setShowProfile(!showProfile)}>
                        <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                        <div className="profile-info">
                            <span className="name">{user?.username}</span>
                            <span className="badge">✦ Member</span>
                        </div>
                        {showProfile && (
                            <div className="profile-popover">
                                <button
                                    className="btn-signout"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        navigate('/login');
                                    }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="content-container">
                <div className="topbar">
                    <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>
                    <span className="topbar-title">Travel Concierge</span>
                </div>

                <div className="chat-scroller">
                    <div className="chat-max-width">

                        {messages.length === 0 && !loading && (
                            <div className="welcome-hero">
                                <h1>Where to next, <span>{user?.username}</span>?</h1>
                                <p>Plan your perfect trip, explore hidden gems, or get a real-time budget breakdown.</p>
                                <div className="welcome-prompts">
                                    {PROMPT_CHIPS.map((chip, i) => (
                                        <button key={i} className="prompt-chip" onClick={() => handleChip(chip)}>
                                            <strong>{chip.title}</strong>
                                            {chip.desc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`message-row ${m.sender}`}>
                                {m.sender === 'user'
                                    ? <div className="user-bubble">{m.message}</div>
                                    : <ChatMessage role={m.sender} content={m.message} />
                                }
                            </div>
                        ))}

                        {loading && (
                            <div className="message-row bot">
                                <div className="bubble thinking">
                                    <div className="dots">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>
                </div>

                <div className="input-section">
                    <div className="chat-max-width">
                        <form className="input-box" onSubmit={handleSend}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask about destinations, budgets, itineraries…"
                            />
                            <button type="submit" disabled={!input.trim() || loading}>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </form>
                        <p className="input-hint">TravelAI can make mistakes. Always verify critical travel info.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
