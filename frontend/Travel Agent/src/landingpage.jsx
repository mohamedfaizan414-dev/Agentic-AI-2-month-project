import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DESTINATIONS = [
  { city: 'Santorini', country: 'Greece', emoji: '🏛', temp: '24°C', vibe: 'Romantic escape' },
  { city: 'Kyoto', country: 'Japan', emoji: '⛩', temp: '18°C', vibe: 'Cultural journey' },
  { city: 'Maldives', country: 'Indian Ocean', emoji: '🏝', temp: '30°C', vibe: 'Luxury resort' },
  { city: 'Patagonia', country: 'Argentina', emoji: '🏔', temp: '8°C', vibe: 'Wild adventure' },
  { city: 'Marrakech', country: 'Morocco', emoji: '🕌', temp: '28°C', vibe: 'Desert mystique' },
  { city: 'Amalfi', country: 'Italy', emoji: '🍋', temp: '22°C', vibe: 'Coastal bliss' },
];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Real-time intelligence',
    desc: 'Live flight prices, hotel availability, weather forecasts, and train schedules — all fetched the moment you ask.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    title: 'Smart itinerary builder',
    desc: 'Day-by-day plans with real restaurant names, transport links, budget tables, and packing lists — not generic suggestions.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Visa & safety alerts',
    desc: 'Instant visa requirements, travel advisories, and entry rules for any passport — checked before your itinerary is finalised.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Multi-currency budgets',
    desc: 'Live exchange rates, per-person breakdowns, and category spending tables — so you never blow your budget again.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Group trip planning',
    desc: 'Split costs, coordinate dates, and generate group-optimised itineraries for up to 20 travellers seamlessly.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Conversational memory',
    desc: 'ARIA remembers your preferences, past trips, and travel style across every conversation — getting smarter each time.',
  },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Travel blogger', text: 'I planned a 3-week Japan trip in under 20 minutes. The visa check alone saved me days of research.', avatar: 'PS' },
  { name: 'Marcus Wei', role: 'Digital nomad', text: 'Finally an AI that actually fetches real prices. Every hotel it suggested was within my budget.', avatar: 'MW' },
  { name: 'Sofia Mendez', role: 'Honeymoon planner', text: 'The Santorini itinerary was so detailed it felt like a local friend wrote it. Absolutely magical.', avatar: 'SM' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('mousemove', handleMouse); window.removeEventListener('scroll', handleScroll); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveCard(p => (p + 1) % DESTINATIONS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const orbX = mousePos.x * 60 - 30;
  const orbY = mousePos.y * 60 - 30;

  return (
    <div style={{ background: '#06080e', color: '#e8eaf0', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 99px; }
        @keyframes float-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.5);opacity:0} }
        @keyframes slide-in-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes card-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .nav-link { color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #c9a84c; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #e8eaf0; padding: 10px 24px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #c9a84c; color: #c9a84c; }
        .btn-gold { background: #c9a84c; color: #06080e; border: none; padding: 10px 24px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-gold:hover { background: #e8c97a; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(201,168,76,0.35); }
        .btn-gold-lg { background: #c9a84c; color: #06080e; border: none; padding: 18px 44px; border-radius: 14px; font-family: inherit; font-size: 17px; font-weight: 600; cursor: pointer; transition: all 0.3s; letter-spacing: 0.2px; }
        .btn-gold-lg:hover { background: #e8c97a; transform: translateY(-3px); box-shadow: 0 20px 50px rgba(201,168,76,0.4); }
        .btn-outline-lg { background: transparent; color: #e8eaf0; border: 1px solid rgba(255,255,255,0.15); padding: 18px 44px; border-radius: 14px; font-family: inherit; font-size: 17px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .btn-outline-lg:hover { border-color: #c9a84c; color: #c9a84c; }
        .feature-card { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 36px 32px; transition: all 0.3s; cursor: default; position: relative; overflow: hidden; }
        .feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#c9a84c,transparent); opacity:0; transition:opacity 0.3s; }
        .feature-card:hover { border-color: rgba(201,168,76,0.2); transform: translateY(-6px); background: linear-gradient(135deg, rgba(201,168,76,0.05), rgba(255,255,255,0.02)); }
        .feature-card:hover::before { opacity:1; }
        .dest-chip { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px 18px; transition:all 0.3s; cursor:pointer; }
        .dest-chip:hover, .dest-chip.active { border-color:rgba(201,168,76,0.4); background:rgba(201,168,76,0.07); }
        .testimonial-card { background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:32px; }
        .stat-item { text-align:center; }
        .floating-card { position:absolute; background:rgba(13,16,23,0.92); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:16px 20px; backdrop-filter:blur(20px); white-space:nowrap; }
        input { outline:none; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', height: 72, background: 'rgba(6,8,14,0.75)', backdropFilter: 'blur(28px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: 0.5 }}>
          Travel<span style={{ color: '#c9a84c' }}>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#destinations" className="nav-link">Destinations</a>
          <a href="#testimonials" className="nav-link">Stories</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-gold" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '140px 6% 80px', position: 'relative' }}>
        {/* Animated orbs */}
        <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%)', top: '50%', left: '50%', transform: `translate(calc(-50% + ${orbX}px), calc(-60% + ${orbY}px))`, transition: 'transform 0.8s ease', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,184,154,0.04) 0%, transparent 70%)', top: '30%', left: '20%', transform: `translate(${-orbX * 0.5}px, ${-orbY * 0.5}px)`, transition: 'transform 1.2s ease', pointerEvents: 'none' }} />

        {/* Floating destination cards */}
        <div className="floating-card" style={{ top: '22%', left: '8%', animation: 'float-up 4s ease-in-out infinite' }}>
          <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Live price</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>Mumbai → Tokyo</div>
          <div style={{ fontSize: 22, color: '#c9a84c', fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>₹42,800</div>
          <div style={{ fontSize: 11, color: '#34d399', marginTop: 4 }}>↓ 12% this week</div>
        </div>
        <div className="floating-card" style={{ top: '30%', right: '7%', animation: 'float-up 4s ease-in-out infinite 1.5s' }}>
          <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Weather in Bali</div>
          <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: '#e8c97a' }}>31°C</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>Sunny · Humidity 74%</div>
        </div>
        <div className="floating-card" style={{ bottom: '28%', left: '9%', animation: 'float-up 4s ease-in-out infinite 0.8s' }}>
          <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Visa status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, background: '#34d399', borderRadius: '50%' }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Visa on arrival</span>
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>India → Thailand · 30 days</div>
        </div>
        <div className="floating-card" style={{ bottom: '25%', right: '8%', animation: 'float-up 4s ease-in-out infinite 2s' }}>
          <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Budget saved</div>
          <div style={{ fontSize: 26, color: '#c9a84c', fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>₹18,400</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>vs. booking separately</div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', border: '1px solid rgba(201,168,76,0.35)', borderRadius: 99, fontSize: 12, fontWeight: 500, color: '#c9a84c', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 36, background: 'rgba(201,168,76,0.06)' }}>
            <span style={{ width: 6, height: 6, background: '#c9a84c', borderRadius: '50%', display: 'inline-block', animation: 'glow-pulse 2s infinite' }} />
            AI-powered travel concierge
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(56px, 9vw, 108px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-2px', marginBottom: 28 }}>
            Travel smarter.<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Dream bigger.</em>
          </h1>

          <p style={{ fontSize: 20, color: '#9ca3af', fontWeight: 300, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 52px' }}>
            Your personal AI concierge that books nothing — but knows everything. Real-time prices, curated itineraries, visa checks, and expert recommendations in seconds.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            <button className="btn-gold-lg" onClick={() => navigate('/register')}>
              Start planning free →
            </button>
            <button className="btn-outline-lg" onClick={() => navigate('/login')}>
              See a live demo
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[['190+', 'Countries covered'], ['10 tools', 'Live data sources'], ['30 sec', 'To full itinerary']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: '#c9a84c', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, letterSpacing: 0.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 1, height: 52, background: 'linear-gradient(to bottom, #c9a84c, transparent)', animation: 'float-up 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 10, color: '#6b7280', letterSpacing: 2.5, textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* LIVE DEMO STRIP */}
      <section style={{ padding: '0 0 100px', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', marginBottom: 80, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 48, animation: 'card-scroll 20s linear infinite', width: 'max-content' }}>
            {[...DESTINATIONS, ...DESTINATIONS].map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 20 }}>{d.emoji}</span>
                <span style={{ color: '#e8eaf0', fontWeight: 500 }}>{d.city}</span>
                <span>·</span>
                <span style={{ color: '#c9a84c' }}>{d.temp}</span>
                <span>·</span>
                <span>{d.vibe}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAKE CHAT DEMO */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 6%' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>See it in action</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 400, letterSpacing: '-0.5px' }}>
              One message. A full trip plan.
            </h2>
          </div>

          <div style={{ background: 'rgba(13,16,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, background: '#34d399', borderRadius: '50%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#34d399', animation: 'pulse-ring 1.5s infinite' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#9ca3af' }}>ARIA · Travel Concierge</span>
            </div>

            {/* Messages */}
            <div style={{ padding: '28px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '18px 18px 4px 18px', padding: '14px 20px', maxWidth: '72%', fontSize: 15, lineHeight: 1.55 }}>
                  Plan a 5-day trip from Delhi to Goa in January, budget ₹40,000 for 2 people.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px', padding: '18px 22px', flex: 1, fontSize: 14, lineHeight: 1.75, color: '#c8cdd8' }}>
                  <p style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>✦ ARIA fetched: flights · hotels · weather · visa</p>
                  <p style={{ marginBottom: 12 }}><strong style={{ color: '#e8eaf0' }}>✈️ Getting there</strong><br />IndiGo DEL→GOA on 5 Jan — ₹5,200/person (round trip ₹10,400). Book 2+ weeks ahead for this price.</p>
                  <p style={{ marginBottom: 12 }}><strong style={{ color: '#e8eaf0' }}>🌤 January weather</strong><br />Goa in Jan is peak season — 28°C, sunny skies, light breeze. Perfect beach weather.</p>
                  <p style={{ marginBottom: 0 }}><strong style={{ color: '#e8eaf0' }}>💰 Budget breakdown</strong><br />Flights ₹10,400 · Stays ₹15,000 · Food ₹8,000 · Activities ₹4,500 · Misc ₹2,100 = <strong style={{ color: '#c9a84c' }}>₹40,000 ✓</strong></p>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button className="btn-gold" onClick={() => navigate('/register')} style={{ padding: '12px 32px', fontSize: 15, borderRadius: 12 }}>
                  Try it yourself →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 6%', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>Why TravelAI</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,54px)', fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 16 }}>Built for the modern explorer</h2>
          <p style={{ color: '#9ca3af', fontSize: 17, fontWeight: 300, maxWidth: 520, margin: '0 auto' }}>Not a chatbot with travel tips. A real intelligence with live tools.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ width: 52, height: 52, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" style={{ padding: '100px 6%', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>Explore anywhere</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,54px)', fontWeight: 400 }}>
            Ask about any destination
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {DESTINATIONS.map((d, i) => (
            <div
              key={i}
              className={`dest-chip ${activeCard === i ? 'active' : ''}`}
              onClick={() => setActiveCard(i)}
              style={{ cursor: 'pointer' }}
            >
              <span style={{ fontSize: 28 }}>{d.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{d.city}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{d.country} · {d.vibe}</div>
              </div>
              <div style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", color: '#c9a84c', fontWeight: 300 }}>{d.temp}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn-gold-lg" onClick={() => navigate('/register')}>
            Plan your trip now
          </button>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '80px 6%', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '0 0 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }}>
          {[['2M+', 'Itineraries generated'], ['190+', 'Countries covered'], ['4.9★', 'Average rating'], ['30s', 'To full plan']].map(([v, l]) => (
            <div key={l} className="stat-item">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: '#c9a84c', lineHeight: 1, marginBottom: 8 }}>{v}</div>
              <div style={{ color: '#6b7280', fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: '0 6% 120px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>Traveller stories</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 400 }}>
            Real trips. Real savings.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#c9a84c', fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: '#c8cdd8', fontWeight: 300, marginBottom: 24 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#06080e' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 6% 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', background: 'linear-gradient(135deg, rgba(201,168,76,0.07), rgba(255,255,255,0.02))', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 32, padding: '72px 56px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 20 }}>
            Your next adventure<br /><em style={{ color: '#c9a84c' }}>starts here.</em>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 17, fontWeight: 300, marginBottom: 44 }}>Join thousands of explorers who plan smarter with AI.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold-lg" onClick={() => navigate('/register')}>Begin your journey →</button>
            <button className="btn-outline-lg" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600 }}>
          Travel<span style={{ color: '#c9a84c' }}>AI</span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>© 2025 TravelAI. Not a travel agency — an intelligence.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" className="nav-link" style={{ fontSize: 13 }}>Privacy</a>
          <a href="#" className="nav-link" style={{ fontSize: 13 }}>Terms</a>
          <a href="#" className="nav-link" style={{ fontSize: 13 }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
