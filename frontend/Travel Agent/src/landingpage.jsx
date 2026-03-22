import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={s.container}>
            {/* Navbar */}
            <nav id='nav-btn'>
                <div style={s.logo}>TravelAgent<span>AI</span></div>
                <div style={s.navLinks}>
                    <button onClick={() => navigate('/login')}  id='lgn-btn-nav'>Login</button>
                    <button onClick={() => navigate('/register')} id='reg-btn-nav'>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={s.hero}>
                <div style={s.heroContent}>
                    <h1 id='nav-title-main'>Travel Planning, <br /><span style={s.gradientText}>Reimagined by AI.</span></h1>
                    <p id='nav-title-p'>
                        Stop spending hours on spreadsheets. Get personalized itineraries, 
                        budget breakdowns, and hidden gems in seconds.
                    </p>
                    <div style={s.ctaGroup}>
                        <button onClick={() => navigate('/register')} id='nav-btn-jrn'>Start Your Journey</button>
                        <button id='nav-btn-dmo' onClick={() => navigate('/register')} >View Demo</button>
                    </div>
                </div>
                
               
            </header>

            {/* Features Section */}
            <section style={s.features}>
                <div style={s.featureCard}>
                    <div style={s.icon}>🌍</div>
                    <h3>Global Knowledge</h3>
                    <p>Access data on over 190 countries and millions of local spots.</p>
                </div>
                <div style={s.featureCard}>
                    <div style={s.icon}>💰</div>
                    <h3>Budget Optimized</h3>
                    <p>Our AI calculates real-time costs to keep you within your limits.</p>
                </div>
                <div style={s.featureCard}>
                    <div style={s.icon}>⚡</div>
                    <h3>Instant Chat</h3>
                    <p>Natural conversations that feel like talking to a local guide.</p>
                </div>
            </section>
        </div>
    );
};

const s = {
    container: {
        backgroundColor: '#0a0a0b',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden'
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '-1px'
    },

    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '160px 8% 80px 8%',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    heroContent: {
        flex: 1,
        maxWidth: '600px'
    },
 
    gradientText: {
        background: 'linear-gradient(90deg, #10a37f, #3dcf8e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
   
    ctaGroup: {
        display: 'flex',
        gap: '20px'
    },
 
    mockupContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '30px',
        borderRadius: '24px',
        width: '350px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'float 6s ease-in-out infinite'
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        padding: '80px 8%',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    featureCard: {
        background: 'rgba(255,255,255,0.02)',
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center'
    },
    icon: {
        fontSize: '40px',
        marginBottom: '20px'
    }
};

export default LandingPage;