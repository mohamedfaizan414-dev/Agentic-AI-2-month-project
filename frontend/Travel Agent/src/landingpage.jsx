import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={s.container}>
            {/* Navbar */}
            <nav style={s.navbar}>
                <div style={s.logo}>TravelAgent<span>AI</span></div>
                <div style={s.navLinks}>
                    <button onClick={() => navigate('/login')} style={s.loginBtn}>Login</button>
                    <button onClick={() => navigate('/register')} style={s.signupBtn}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={s.hero}>
                <div style={s.heroContent}>
                    <h1 style={s.title}>Travel Planning, <br /><span style={s.gradientText}>Reimagined by AI.</span></h1>
                    <p style={s.subtitle}>
                        Stop spending hours on spreadsheets. Get personalized itineraries, 
                        budget breakdowns, and hidden gems in seconds.
                    </p>
                    <div style={s.ctaGroup}>
                        <button onClick={() => navigate('/register')} style={s.mainCta}>Start Your Journey</button>
                        <button style={s.secondaryCta} onClick={() => navigate('/register')} >View Demo</button>
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
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 8%',
        background: 'rgba(10, 10, 11, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '-1px'
    },
    loginBtn: {
        background: 'transparent',
        backgroundColor: 'blue',
        padding: '10px 20px',
        borderRadius: '8px',
        color: '#fff',
        border: 'none',
        marginRight: '20px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    signupBtn: {
        background: '#fff',
        color: '#000',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer'
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
    title: {
        fontSize: '64px',
        lineHeight: '1.1',
        marginBottom: '24px',
        fontWeight: '800'
    },
    gradientText: {
        background: 'linear-gradient(90deg, #10a37f, #3dcf8e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '20px',
        color: '#a0a0a8',
        lineHeight: '1.6',
        marginBottom: '40px'
    },
    ctaGroup: {
        display: 'flex',
        gap: '20px'
    },
    mainCta: {
        backgroundColor: '#10a37f',
        color: '#fff',
        padding: '16px 32px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s'
    },
    secondaryCta: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#fff',
        padding: '16px 32px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        fontSize: '18px',
        cursor: 'pointer'
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