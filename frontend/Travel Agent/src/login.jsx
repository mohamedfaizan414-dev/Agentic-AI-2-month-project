import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { api } from './api.js';

const Login = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                username: formData.identifier,
                email: formData.identifier,
                password: formData.password
            };
            const response = await api.post('/api/auth/login', payload);
            localStorage.setItem("token", response.data.token);
            if (response.status === 200) {
                navigate('/chat');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap auth-split">
            <section className="auth-showcase">
                <div className="auth-brand">Azen<span>tix</span></div>
                <span className="eyebrow">TRAVEL, INTELLIGENTLY</span>
                <h1>Every journey<br /><em>starts with a feeling.</em></h1>
                <p>Plan remarkable escapes with a concierge that remembers every detail.</p>
                <div className="auth-trip-card"><span>✦</span><div><b>Next escape</b><small>Kyoto · 7 days · tailored for you</small></div></div>
            </section>
            <section className="auth-card">
                <div className="auth-logo">Welcome to Azen<span>tix</span></div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue your journey</p>
                <div className="auth-divider" />

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">Username or Email</label>
                        <input
                            className="auth-input"
                            type="text"
                            name="identifier"
                            placeholder="you@example.com"
                            value={formData.identifier}
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
                            value={formData.password}
                            onChange={handleChange}
                            required
                        /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-footer">
                    New here?{' '}
                    <a href="/register">Create an account</a>
                </p>
            </section>
        </div>
    );
};

export default Login;
