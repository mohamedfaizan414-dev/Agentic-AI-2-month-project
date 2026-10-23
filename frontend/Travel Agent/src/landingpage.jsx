import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 6l6 6-6 6" /></svg>;

export default function LandingPage() {
  const navigate = useNavigate();
  return <div className="atlas-home">
    <nav className="atlas-nav"><button className="atlas-mark" onClick={() => navigate('/')}>ATLAS<span>.</span></button><div><button className="nav-link" onClick={() => navigate('/login')}>Sign in</button><button className="nav-cta" onClick={() => navigate('/register')}>Start planning <Arrow /></button></div></nav>
    <main>
      <section className="atlas-hero"><div className="atlas-hero-copy"><p className="kicker">A PERSONAL TRAVEL DESK</p><h1>Make room for<br /><em>the good trip.</em></h1><p className="hero-body">Atlas turns a few intentions into a considered itinerary: clear, calm, and built around how you actually like to travel.</p><div className="hero-actions"><button className="atlas-primary" onClick={() => navigate('/register')}>Plan a journey <Arrow /></button><button className="atlas-text-action" onClick={() => navigate('/login')}>Return to your plans</button></div></div><div className="itinerary-card"><div className="itinerary-card-top"><span>ITINERARY / 01</span><span>7 DAYS</span></div><div className="itinerary-route"><small>THE JAPAN EDIT</small><h2>Tokyo — Kyoto</h2><p>12–19 October · A slower first week</p></div><div className="itinerary-stops"><div><b>01</b><span><strong>Tokyo</strong><small>Neighbourhoods after dark</small></span></div><div><b>03</b><span><strong>Hakone</strong><small>Water, mountains, a long lunch</small></span></div><div><b>05</b><span><strong>Kyoto</strong><small>Early walks and quiet tables</small></span></div></div><div className="itinerary-card-footer"><span>Built around your pace</span><Arrow /></div></div></section>
      <section className="atlas-principles"><p className="kicker">A BETTER STARTING POINT</p><h2>Less searching. More going.</h2><div className="principle-grid"><article><span>01</span><h3>Start with what matters.</h3><p>Dates, mood, budget, pace. Atlas asks the right questions before making a suggestion.</p></article><article><span>02</span><h3>Keep every detail together.</h3><p>Build, refine, and return to plans without losing the useful parts of the conversation.</p></article><article><span>03</span><h3>Make the decision easier.</h3><p>Clear options and practical trade-offs so your next step is always obvious.</p></article></div></section>
      <section className="atlas-closing"><p className="kicker">WHERE TO NEXT</p><h2>Your next trip<br /><em>begins with a thought.</em></h2><button className="atlas-primary" onClick={() => navigate('/register')}>Create your travel desk <Arrow /></button></section>
    </main>
  </div>;
}
