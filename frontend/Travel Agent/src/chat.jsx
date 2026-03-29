import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './message.jsx';

const BackendUrl = 'https://express-backend-quh7.onrender.com';

const CHIPS = [
  { icon: '🗺', label: 'Itinerary', prompt: '7 days in Japan, culture and food, budget ₹1.5L for 2 people' },
  { icon: '✈', label: 'Flights', prompt: 'Find me flights from Delhi to Bali this December' },
  { icon: '🌤', label: 'Weather', prompt: 'What is the weather like in Santorini in May?' },
  { icon: '🛂', label: 'Visa', prompt: 'Visa requirements for Indian passport holders going to Europe' },
  { icon: '🏨', label: 'Hotels', prompt: 'Best hotels in Goa under ₹4000 per night in January' },
  { icon: '🎒', label: 'Packing', prompt: 'Packing list for 2 weeks in Iceland in winter with hiking' },
];

const chatCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&family=Space+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #06080e; color: #e8eaf0; font-family: 'DM Sans', sans-serif; overflow: hidden; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #1e2130; border-radius: 99px; }
  @keyframes msg-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dot-bounce { 0%,80%,100%{transform:scale(0.5);opacity:0.35} 40%{transform:scale(1);opacity:1} }
  @keyframes glow-pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes slide-in { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes badge-pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  .sidebar-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px; cursor:pointer; transition:all 0.18s; color:#6b7280; font-size:13px; border:1px solid transparent; }
  .sidebar-item:hover { background:rgba(255,255,255,0.04); color:#e8eaf0; }
  .sidebar-item.active { background:rgba(201,168,76,0.08); color:#c9a84c; border-color:rgba(201,168,76,0.15); }
  .sidebar-item .del-btn { opacity:0; margin-left:auto; background:none; border:none; color:#6b7280; cursor:pointer; font-size:15px; line-height:1; padding:0 2px; border-radius:4px; transition:all 0.15s; }
  .sidebar-item:hover .del-btn { opacity:1; }
  .sidebar-item .del-btn:hover { color:#f87171; background:rgba(248,113,113,0.1); }
  .chip-btn { display:flex; align-items:center; gap:8px; padding:10px 16px; background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.08); border-radius:12px; color:#9ca3af; font-size:13px; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; text-align:left; }
  .chip-btn:hover { border-color:rgba(201,168,76,0.3); color:#e8eaf0; background:rgba(201,168,76,0.05); transform:translateY(-2px); }
  .send-btn { background:#c9a84c; border:none; width:40px; height:40px; border-radius:11px; color:#06080e; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
  .send-btn:hover:not(:disabled) { background:#e8c97a; transform:scale(1.05); }
  .send-btn:disabled { background:rgba(255,255,255,0.08); color:#4b5563; cursor:not-allowed; }
  .search-input { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:8px 12px 8px 34px; color:#e8eaf0; font-family:'DM Sans',sans-serif; font-size:12px; outline:none; width:100%; transition:border-color 0.2s; }
  .search-input::placeholder { color:#4b5563; }
  .search-input:focus { border-color:rgba(201,168,76,0.3); }
  .new-chat-btn { display:flex; align-items:center; gap:8px; width:100%; background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.18); color:#c9a84c; padding:10px 14px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; margin-bottom:12px; }
  .new-chat-btn:hover { background:rgba(201,168,76,0.14); }
  .stage-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:99px; font-size:11px; font-weight:500; letter-spacing:0.4px; animation:badge-pop 0.4s ease; }
  .msg-textarea { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:14px; color:#e8eaf0; padding:14px 54px 14px 18px; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; resize:none; line-height:1.55; max-height:180px; overflow-y:auto; transition:all 0.2s; caret-color:#c9a84c; }
  .msg-textarea::placeholder { color:#4b5563; }
  .msg-textarea:focus { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.03); box-shadow:0 0 0 3px rgba(201,168,76,0.06); }
  kbd { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:5px; padding:1px 6px; font-family:'Space Mono',monospace; font-size:10px; color:#9ca3af; }
`;

export default function ChatPage() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sessions, setSessions]   = useState([]);
  const [activeId, setActiveId]   = useState(null);
  const [user, setUser]           = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [stage, setStage]         = useState('idle');
  const [error, setError]         = useState('');
  const [searchQ, setSearchQ]     = useState('');
  const [copied, setCopied]       = useState(false);

  const scrollRef  = useRef(null);
  const inputRef   = useRef(null);
  const navigate   = useNavigate();
  const token      = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BackendUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(data);
        await loadSessions();
      } catch { navigate('/login'); }
    })();
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (!loading) inputRef.current?.focus(); }, [loading, activeId]);

  const loadSessions = async () => {
    try {
      const { data } = await axios.get(`${BackendUrl}/api/sessions`, { headers: { Authorization: `Bearer ${token}` } });
      setSessions(data);
    } catch {}
  };

  const openSession = async (id) => {
    setActiveId(id); setMessages([]); setStage('idle'); setError('');
    try {
      const { data } = await axios.get(`${BackendUrl}/api/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(data);
      const last = data[data.length - 1];
      if (last?.metadata?.stage) setStage(last.metadata.stage);
    } catch { setError('Could not load conversation.'); }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${BackendUrl}/api/session/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (activeId === id) { setActiveId(null); setMessages([]); setStage('idle'); }
      await loadSessions();
    } catch {}
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const optimistic = { message: text, sender: 'user', _id: Date.now() };
    setMessages(p => [...p, optimistic]);
    setInput(''); setLoading(true); setError('');

    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/chat`,
        { message: text, conversationId: activeId },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 120000 }
      );
      setMessages(p => [...p, { message: data.reply, sender: 'bot', _id: Date.now() + 1, metadata: { stage: data.stage } }]);
      if (data.stage) setStage(data.stage);
      if (!activeId) { setActiveId(data.conversationId); await loadSessions(); }
    } catch (err) {
      setMessages(p => p.filter(m => m._id !== optimistic._id));
      setError(err.response?.data?.error || 'Something went wrong. Please retry.');
    } finally { setLoading(false); }
  }, [input, loading, activeId, token]);

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const startNew = () => { setActiveId(null); setMessages([]); setStage('idle'); setError(''); inputRef.current?.focus(); };

  const copyLast = () => {
    const last = [...messages].reverse().find(m => m.sender === 'bot');
    if (last) { navigator.clipboard.writeText(last.message); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const filtered = sessions.filter(s => !searchQ || (s.title || '').toLowerCase().includes(searchQ.toLowerCase()));
  const initial = user?.username?.charAt(0).toUpperCase() || '?';

  const stageMeta = {
    active:   { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.2)', dot: '#c9a84c', label: 'Planning' },
    finalize: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', dot: '#60a5fa', label: 'Generating…' },
    done:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', dot: '#34d399', label: 'Itinerary Ready' },
  };
  const sm = stageMeta[stage];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#06080e', overflow: 'hidden' }}>
      <style>{chatCSS}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 264 : 0,
        minWidth: sidebarOpen ? 264 : 0,
        background: '#0a0d14',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: sidebarOpen ? '22px 14px' : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, padding: '0 6px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 14, whiteSpace: 'nowrap' }}>
          Travel<span style={{ color: '#c9a84c' }}>AI</span>
        </div>

        <button className="new-chat-btn" onClick={startNew}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New conversation
        </button>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="search-input" placeholder="Search chats…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        </div>

        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#4b5563', padding: '0 6px', marginBottom: 8 }}>Recent</div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 && <p style={{ fontSize: 13, color: '#4b5563', padding: '12px 6px' }}>No conversations yet</p>}
          {filtered.map(s => (
            <div key={s._id} className={`sidebar-item ${activeId === s._id ? 'active' : ''}`} onClick={() => openSession(s._id)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title || 'Travel plan'}</span>
              <button className="del-btn" onClick={e => deleteSession(s._id, e)}>×</button>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={() => setShowProfile(!showProfile)}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#c9a84c,#e8c97a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#06080e', flexShrink: 0 }}>{initial}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
              <div style={{ fontSize: 10, color: '#c9a84c', letterSpacing: 0.5 }}>✦ Member</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          {showProfile && (
            <div style={{ background: '#0f1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.username}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{user?.email}</div>
              </div>
              <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                style={{ width: '100%', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', color: '#f87171', padding: '8px', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <div style={{ height: 58, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,8,14,0.85)', backdropFilter: 'blur(20px)', flexShrink: 0, gap: 14 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#9ca3af'; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: '#9ca3af' }}>Travel Concierge</span>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {sm && stage !== 'idle' && (
              <div className="stage-pill" style={{ background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color }}>
                <div style={{ width: 6, height: 6, background: sm.dot, borderRadius: '50%', animation: stage !== 'done' ? 'glow-pulse 1.5s infinite' : 'none' }} />
                {sm.label}
              </div>
            )}
            {stage === 'done' && (
              <button onClick={copyLast} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: copied ? '#34d399' : '#c9a84c', padding: '5px 12px', borderRadius: 8, fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                {copied ? 'Copied!' : 'Copy itinerary'}
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 0' }}>
          <div style={{ width: '92%', maxWidth: 820, margin: '0 auto' }}>

            {/* Welcome */}
            {messages.length === 0 && !loading && (
              <div style={{ paddingTop: 40 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400, marginBottom: 10, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
                    Where to next, <span style={{ color: '#c9a84c' }}>{user?.username || 'explorer'}</span>?
                  </div>
                  <p style={{ fontSize: 15, color: '#6b7280', fontWeight: 300, maxWidth: 480 }}>
                    Real-time prices, visa checks, weather, and complete itineraries — all in one conversation.
                  </p>
                </div>

                {/* Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 32, maxWidth: 720 }}>
                  {CHIPS.map((c, i) => (
                    <button key={i} className="chip-btn" onClick={() => { setInput(c.prompt); inputRef.current?.focus(); }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#e8eaf0', fontSize: 12, marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>{c.prompt.slice(0, 36)}…</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* What ARIA can do */}
                <div style={{ marginTop: 44, padding: '20px 24px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, maxWidth: 600 }}>
                  <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 14 }}>ARIA uses 10 live tools</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Live flight search', 'Hotel availability', 'Weather forecast', 'Visa requirements', 'Train schedules', 'Currency rates', 'POI finder', 'Packing lists', 'Travel advisories', 'Budget planning'].map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9ca3af' }}>
                        <div style={{ width: 5, height: 5, background: '#34d399', borderRadius: '50%', flexShrink: 0 }} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m, i) => (
              <div key={m._id || i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24, gap: 10, justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', animation: 'msg-in 0.25s ease' }}>
                {m.sender === 'bot' && (
                  <div style={{ width: 30, height: 30, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                )}
                {m.sender === 'user'
                  ? <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.06))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '18px 18px 4px 18px', padding: '13px 18px', maxWidth: 560, fontSize: 15, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{m.message}</div>
                  : <ChatMessage role="bot" content={m.message} />
                }
              </div>
            ))}

            {/* Thinking */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, animation: 'msg-in 0.25s ease' }}>
                <div style={{ width: 30, height: 30, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' }}>ARIA is researching</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, background: '#c9a84c', borderRadius: '50%', animation: `dot-bounce 1.4s infinite ${i*0.15}s`, opacity: 0.6 }} />)}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.18)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 16 }}>
                <span>⚠ {error}</span>
                <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </div>

        {/* INPUT */}
        <div style={{ padding: '14px 0 28px', background: 'linear-gradient(0deg, #06080e 60%, transparent)', flexShrink: 0 }}>
          <div style={{ width: '92%', maxWidth: 820, margin: '0 auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <textarea
                ref={inputRef}
                className="msg-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about destinations, budgets, flights, itineraries…"
                rows={1}
                disabled={loading}
              />
              <button className="send-btn" onClick={send} disabled={!input.trim() || loading}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#374151', marginTop: 10 }}>
              <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line &nbsp;·&nbsp; TravelAI may make mistakes — always verify critical info
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
