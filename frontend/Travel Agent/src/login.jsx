import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BackendUrl = 'https://express-backend-quh7.onrender.com';

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #06080e; }
  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
  @keyframes float-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  .auth-input {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #e8eaf0; padding: 15px 18px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none;
    transition: all 0.25s; caret-color: #c9a84c;
  }
  .auth-input::placeholder { color: #4b5563; }
  .auth-input:focus { border-color: #c9a84c; background: rgba(201,168,76,0.04); box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
  .auth-input:hover:not(:focus) { border-color: rgba(255,255,255,0.18); }
  .auth-btn {
    width: 100%; background: #c9a84c; color: #06080e; border: none;
    border-radius: 12px; padding: 16px; font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.25s; letter-spacing: 0.2px;
  }
  .auth-btn:hover:not(:disabled) { background: #e8c97a; transform: translateY(-2px); box-shadow: 0 12px 36px rgba(201,168,76,0.35); }
  .auth-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .back-link { color: #6b7280; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; transition: color 0.2s; }
  .back-link:hover { color: #c9a84c; }
  .feature-pill { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; }
`;

export function Login() {
  const [form, setForm]       = useState({ identifier: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setShow(true), 50); }, []);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${BackendUrl}/api/auth/login`, {
        username: form.identifier, email: form.identifier, password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#06080e', color: '#e8eaf0', fontFamily: "'DM Sans', sans-serif", display: 'flex', overflow: 'hidden' }}>
      <style>{authStyles}</style>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 6%', position: 'relative' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 440, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', position: 'relative' }}>
          {/* Back link */}
          <a href="/" className="back-link" style={{ marginBottom: 40, display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </a>

          {/* Logo */}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 36 }}>
            Travel<span style={{ color: '#c9a84c' }}>AI</span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.1 }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, fontWeight: 300, marginBottom: 40 }}>Sign in to continue your journey</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Username or email</label>
              <input className="auth-input" type="text" name="identifier" placeholder="you@example.com" value={form.identifier} onChange={handle} required />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#c9a84c', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input className="auth-input" type="password" name="password" placeholder="••••••••••" value={form.password} onChange={handle} required />
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin-slow 1s linear infinite' }}><path d="M21 12a9 9 0 11-6-8.5"/></svg>
                  Signing in…
                </span>
              ) : 'Sign in to TravelAI'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#6b7280' }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}>Create a free account →</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: '45%', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Floating cards */}
        <div style={{ position: 'absolute', top: 80, right: 60, background: 'rgba(13,16,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', animation: 'float-a 5s ease-in-out infinite', fontSize: 13 }}>
          <div style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Last trip</div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Rajasthan · 6 days</div>
          <div style={{ color: '#c9a84c' }}>₹38,400 saved</div>
        </div>
        <div style={{ position: 'absolute', bottom: 120, left: 40, background: 'rgba(13,16,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', animation: 'float-b 6s ease-in-out infinite 1s', fontSize: 13 }}>
          <div style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Upcoming</div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Bali · Feb 2025</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, background: '#34d399', borderRadius: '50%' }} />
            <span style={{ color: '#34d399', fontSize: 12 }}>Itinerary ready</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 60, fontWeight: 300, lineHeight: 1, color: '#c9a84c', marginBottom: 8 }}>ARIA</div>
          <div style={{ fontSize: 13, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 48 }}>Your AI Concierge</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', maxWidth: 300 }}>
            {[
              { icon: '✈', text: 'Real-time flight prices' },
              { icon: '🏨', text: 'Live hotel availability' },
              { icon: '🌤', text: 'Destination weather' },
              { icon: '🛂', text: 'Visa requirements check' },
              { icon: '💰', text: 'Smart budget breakdown' },
            ].map((item, i) => (
              <div key={i} className="feature-pill">
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: '#c8cdd8' }}>{item.text}</span>
                <div style={{ marginLeft: 'auto', width: 6, height: 6, background: '#34d399', borderRadius: '50%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;