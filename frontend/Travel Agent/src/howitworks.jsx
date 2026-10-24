import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './atlas-pages.css';

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 6l6 6-6 6" /></svg>;

export default function HowItWorks() {
  const navigate = useNavigate();
  return <div className="atlas-how">
    <nav className="atlas-nav"><button className="atlas-mark" onClick={() => navigate('/')}>ATLAS<span>.</span></button><div><button className="nav-link" onClick={() => navigate('/login')}>Sign in</button><button className="nav-cta" onClick={() => navigate('/register')}>Start planning <Arrow /></button></div></nav>
    <main>
      <header className="how-hero"><p className="kicker">THE ATLAS APPROACH</p><h1>A calmer way<br />to make a <em>good plan.</em></h1><p>Atlas is an ongoing conversation for shaping a trip—one that starts with your priorities and stays useful when the details change.</p></header>
      <section className="how-steps"><article><div><span>01</span><p className="kicker">BEGIN</p><h2>Give the trip a little context.</h2></div><p>Share the destination, dates, budget, or simply the kind of week you want. There is no rigid form to complete before you can begin.</p></article><article><div><span>02</span><p className="kicker">REFINE</p><h2>Turn options into decisions.</h2></div><p>Ask for routes, neighbourhoods, practical timing, or alternatives. Atlas makes trade-offs visible so each choice feels deliberate.</p></article><article><div><span>03</span><p className="kicker">RETURN</p><h2>Keep a travel desk, not another tab.</h2></div><p>Your conversations remain together in one private place, ready for the next detail, adjustment, or entirely new journey.</p></article></section>
      <section className="how-question"><p className="kicker">BUILT FOR THE IN-BETWEEN</p><h2>Where should I stay?<br />Is this route too rushed?<br /><em>What would make it memorable?</em></h2><p>Ask the questions a search box cannot quite answer. Atlas helps you explore the answer, then move on with confidence.</p><button className="atlas-primary" onClick={() => navigate('/register')}>Start your first plan <Arrow /></button></section>
    </main>
  </div>;
}
