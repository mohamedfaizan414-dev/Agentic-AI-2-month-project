import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Register = () => {
    const BackendUrl = 'https://express-backend-quh7.onrender.com';
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');
        setLoading(true);
        try {
            const response = await axios.post(`${BackendUrl}/api/auth/register`, formData);
            if (response.status === 201 || response.status === 200) {
                setMessage('Account created! Redirecting to login…');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap">
            <div className="auth-bg-orb" />
            <div className="auth-card">
                <div className="auth-logo">Travel<span>AI</span></div>
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
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
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
            </div>
        </div>
    );
};

export default Register;
