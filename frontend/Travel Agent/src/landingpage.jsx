import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="land-wrap">

            {/* NAV */}
            <nav className="land-nav">
                <div className="land-logo">Azen<span>tix</span></div>
                <div className="land-nav-links">
                    <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
                </div>
            </nav>

            {/* HERO */}
            <header className="land-hero">
                <div className="hero-glow" />
                <div className="hero-layout">
                    <div className="hero-copy">
                        <div className="hero-badge"><span className="hero-badge-dot" /> AI-Powered Travel Planning</div>
                        <h1 className="hero-title">Explore the world,<br /><em>differently.</em></h1>
                        <p className="hero-sub">Your personal AI travel concierge. Curated itineraries, real-time budgets, and hidden gems — crafted for you in seconds.</p>
                        <div className="hero-cta"><button className="btn-hero" onClick={() => navigate('/register')}>Start Planning Free</button><button className="btn-hero-out" onClick={() => navigate('/login')}>Explore your plans</button></div>
                    </div>
                    <div className="hero-preview" aria-label="A preview of a personalised travel itinerary">
                        <div className="preview-top"><span>✦ Your next escape</span><small>Personalized</small></div>
                        <div className="preview-place"><span>JAPAN</span><strong>Tokyo → Kyoto</strong><small>12–19 October · 7 nights</small></div>
                        <div className="preview-days"><div><b>01</b><span>Arrive in Tokyo<br /><small>Shibuya at golden hour</small></span></div><div><b>03</b><span>Mountain air<br /><small>Day trip to Hakone</small></span></div><div><b>05</b><span>Slow Kyoto<br /><small>Tea, temples, evening walk</small></span></div></div>
                        <div className="preview-footer"><span>Built around your pace</span><span>→</span></div>
                    </div>
                </div>

                <div className="hero-scroll">
                    <div className="hero-scroll-line" />
                    <span>Discover</span>
                </div>
            </header>

            {/* STATS */}
            <section className="land-stats">
                <div className="stats-inner">
                    <div>
                        <div className="stat-val">190+</div>
                        <div className="stat-label">Countries</div>
                    </div>
                    <div>
                        <div className="stat-val">2M+</div>
                        <div className="stat-label">Itineraries</div>
                    </div>
                    <div>
                        <div className="stat-val">4.9★</div>
                        <div className="stat-label">Avg Rating</div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="land-features">
                <p className="features-label">Why TravelAI</p>
                <h2 className="features-heading">Built for the modern explorer</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🌍</div>
                        <h3>Global Intelligence</h3>
                        <p>Deep knowledge of 190+ countries, local customs, visa requirements, and off-the-beaten-path secrets most guides miss.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Budget Mastery</h3>
                        <p>Real-time cost estimates, currency conversion, and smart budget allocation so you never overspend on a trip again.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Concierge</h3>
                        <p>Natural conversation, like texting a seasoned local guide who knows every corner of the city you're visiting.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="land-footer-cta">
                <h2>Your next adventure<br />starts here.</h2>
                <p>Join thousands of travelers planning smarter with AI.</p>
                <button className="btn-hero" onClick={() => navigate('/register')}>
                    Begin Your Journey →
                </button>
            </section>

        </div>
    );
};

export default LandingPage;
