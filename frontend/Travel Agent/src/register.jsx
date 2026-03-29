
import React2, { useState as useState2, useEffect as useEffect2 } from 'react';
import axios2 from 'axios';
import { useNavigate as useNavigate2, Link as Link2 } from 'react-router-dom';

export function Register() {

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

  const [form, setForm]       = useState2({ username: '', email: '', password: '' });
  const [error, setError]     = useState2('');
  const [success, setSuccess] = useState2('');
  const [loading, setLoading] = useState2(false);
  const [show, setShow]       = useState2(false);
  const [strength, setStrength] = useState2(0);
  const navigate = useNavigate2();

  useEffect2(() => { setTimeout(() => setShow(true), 50); }, []);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'password') {
      let s = 0;
      if (value.length >= 8) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setStrength(s);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios2.post(`${BackendUrl}/api/auth/register`, form);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ minHeight: '100vh', background: '#06080e', color: '#e8eaf0', fontFamily: "'DM Sans', sans-serif", display: 'flex', overflow: 'hidden' }}>
      <style>{authStyles}</style>

      {/* LEFT PANEL — visual */}
      <div style={{ width: '42%', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Floating stats */}
        <div style={{ position: 'absolute', top: 90, left: 40, background: 'rgba(13,16,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', animation: 'float-a 5s ease-in-out infinite', fontSize: 13 }}>
          <div style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Trips planned today</div>
          <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: '#c9a84c' }}>1,247</div>
        </div>
        <div style={{ position: 'absolute', bottom: 110, right: 30, background: 'rgba(13,16,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', animation: 'float-b 6s ease-in-out infinite 0.8s', fontSize: 13 }}>
          <div style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Avg money saved</div>
          <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: '#34d399' }}>₹22,400</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>per trip vs. travel agents</div>
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
            Join <span style={{ color: '#c9a84c' }}>2M+</span><br />smart explorers
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, fontWeight: 300, lineHeight: 1.7, maxWidth: 300, margin: '0 auto 40px' }}>
            Free forever. No credit card. No hidden fees. Just better travel.
          </p>

          {/* mini testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', maxWidth: 320 }}>
            {[
              { text: '"Planned Goa in 8 minutes. Insane."', name: 'Arjun M.' },
              { text: '"The visa check saved my honeymoon."', name: 'Riya K.' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, color: '#c8cdd8', marginBottom: 8 }}>{t.text}</p>
                <div style={{ fontSize: 12, color: '#c9a84c' }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 6%', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 440, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', position: 'relative' }}>
          <a href="/" className="back-link" style={{ marginBottom: 40, display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </a>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 36 }}>
            Travel<span style={{ color: '#c9a84c' }}>AI</span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.1 }}>
            Create account
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, fontWeight: 300, marginBottom: 40 }}>Free forever — start planning in seconds</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Username</label>
              <input className="auth-input" type="text" name="username" placeholder="wanderer42" value={form.username} onChange={handle} required minLength={3} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email address</label>
              <input className="auth-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password</label>
              <input className="auth-input" type="password" name="password" placeholder="Min 8 characters" value={form.password} onChange={handle} required minLength={8} />
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#34d399', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                {success}
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>

            <p style={{ fontSize: 12, color: '#4b5563', textAlign: 'center', lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>Terms</a> and{' '}
              <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>Privacy Policy</a>
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
            Already have an account?{' '}
            <Link2 to="/login" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}>Sign in →</Link2>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
