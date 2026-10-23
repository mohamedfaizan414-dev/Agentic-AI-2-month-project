import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { api } from './api.js';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');
        setLoading(true);
        try {
            const response = await api.post('/api/auth/register', formData);
            if (response.status === 201 || response.status === 200) {
                sessionStorage.setItem('verificationEmail', formData.email);
                setMessage('Account created! Redirecting to email verification…');
                setTimeout(() => navigate('/verifyemail'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap auth-split">
            <section className="auth-showcase">
                <div className="auth-brand">Azen<span>tix</span></div>
                <span className="eyebrow">YOUR PRIVATE TRAVEL DESK</span>
                <h1>Plans that feel<br /><em>made for you.</em></h1>
                <p>From a first idea to an unforgettable itinerary, your AI concierge is ready.</p>
                <div className="auth-trip-card"><span>⌁</span><div><b>Ideas become itineraries</b><small>Personal, practical, beautifully simple</small></div></div>
            </section>
            <section className="auth-card">
                <div className="auth-logo">Join Azen<span>tix</span></div>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Join thousands of smart explorers</p>
                <div className="auth-divider" />

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">Username</label>
                        <input
                            className="auth-input"
                            type="text"
                            name="username"
                            placeholder="wanderer42"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <div className="password-field"><input
                            className="auth-input"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <a href="/login">Sign in</a>
                </p>
            </section>
        </div>
    );
};

export default Register;
