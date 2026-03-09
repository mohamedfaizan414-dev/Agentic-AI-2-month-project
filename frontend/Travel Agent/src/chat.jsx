import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './message.jsx';
import './App.css';

axios.defaults.withCredentials = true;

const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    // ⭐ NEW STATE (sidebar toggle)
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const scrollRef = useRef(null);
    const navigate = useNavigate();


    // Initialize user and sessions
// Initialize user and sessions
useEffect(() => {
    const init = async () => {
        try {
            
            const userRes = await axios.get('https://travel-agent-ltzc.onrender.com/api/auth/me');
            setUser(userRes.data);

            
            try {
                const sessRes = await axios.get('https://travel-agent-ltzc.onrender.com/api/sessions');
                setSessions(sessRes.data);
            } catch (sessionErr) {
                console.warn("Sessions failed to load, but user is authenticated.");
            }

        } catch (err) {
            
            console.error("Auth failed:", err);
            navigate('/login');
        }
    };

    init();
}, [navigate]);


    // Auto scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);


    const loadChat = async (sessionId) => {

        setMessages([]);
        setActiveId(sessionId);
        setLoading(true);

        try {

            const res = await axios.get(
                `https://travel-agent-ltzc.onrender.com/api/history/${sessionId}`
            );

            setMessages(res.data);

        } catch (err) {

            console.error("Session load failed", err);

        } finally {

            setLoading(false);

        }

    };


    const handleSend = async (e) => {

        e.preventDefault();

        if (!input.trim() || loading) return;

        const text = input;

        setMessages(prev => [
            ...prev,
            { message: text, sender: 'user' }
        ]);

        setInput('');
        setLoading(true);


        try {

            const res = await axios.post(
                'https://travel-agent-ltzc.onrender.com/api/chat',
                {
                    message: text,
                    conversationId: activeId
                }
            );

            setMessages(prev => [
                ...prev,
                { message: res.data.reply, sender: 'bot' }
            ]);


            if (!activeId) {

                setActiveId(res.data.conversationId);

                const sessRes = await axios.get(
                    'https://travel-agent-ltzc.onrender.com/api/sessions'
                );

                setSessions(sessRes.data);

            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="app-layout">


            {/* SIDEBAR */}

            <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

                <div className="sidebar-top">

                    <h2 id="main-head">Travel Agent</h2>

                    <button
                        className="btn-new-chat"
                        onClick={() => {
                            setActiveId(null);
                            setMessages([]);
                        }}
                    >
                        <span>+</span> New Chat
                    </button>


                    <div className="history-wrapper">

                        <label>Recent Journeys</label>

                        {sessions.map(s => (

                            <div
                                key={s._id}
                                onClick={() => loadChat(s._id)}
                                className={`history-item ${activeId === s._id ? 'active' : ''}`}
                            >
                                💬 {s.title || "Travel Plan"}
                            </div>

                        ))}

                    </div>

                </div>


                {/* PROFILE */}

                <div className="sidebar-bottom">

                    <div
                        className="profile-pill"
                        onClick={() => setShowProfile(!showProfile)}
                    >

                        <div className="avatar">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <span className="name">
                                {user?.username}
                            </span>

                            <span className="badge">
                                Member
                            </span>

                        </div>


                        {showProfile && (

                            <div className="profile-popover">

                                <button
                                    id="btn-signout"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign Out
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </aside>



            {/* MAIN CONTENT */}

            <main className="content-container">


                {/* TOP BAR */}

                <div className="topbar">

                    <button
                        className="menu-btn"
                        onClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    >
                        ☰
                    </button>

                </div>



                {/* CHAT AREA */}

                <div className="chat-scroller">

                    <div className="chat-max-width">

                        {messages.length === 0 && !loading && (

                            <div className="welcome-hero">

                                <h1>
                                    Where to next, {user?.username}?
                                </h1>

                                <p>
                                    Plan your itinerary, manage budgets,
                                    or discover hidden spots.
                                </p>

                            </div>

                        )}


                        {messages.map((m, i) => (

                            <div
                                key={i}
                                className={`message-row ${m.sender}`}
                            >

                                <ChatMessage
                                    role={m.sender}
                                    content={m.message}
                                />

                            </div>

                        ))}



                        {loading && (

                            <div className="message-row bot">

                                <div className="bubble thinking">

                                    <div className="dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                </div>

                            </div>

                        )}

                        <div ref={scrollRef} />

                    </div>

                </div>



                {/* INPUT */}

                <div className="input-section">

                    <div className="chat-max-width">

                        <form
                            className="input-box"
                            onSubmit={handleSend}
                        >

                            <input
                                value={input}
                                onChange={e =>
                                    setInput(e.target.value)
                                }
                                placeholder="Message Travel Agent AI..."
                            />

                            <button
                                type="submit"
                                disabled={!input.trim()}
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                >
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                                </svg>

                            </button>

                        </form>

                    </div>

                </div>


            </main>

        </div>

    );

};

export default ChatPage;