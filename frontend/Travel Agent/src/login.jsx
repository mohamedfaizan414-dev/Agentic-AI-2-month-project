import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
    const BackendUrl = 'https://express-backend-quh7.onrender.com';
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            const response = await axios.post(`${BackendUrl}/api/auth/login`, payload, {
                withCredentials: true
            });
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
        <div className="auth-wrap">
            <div className="auth-bg-orb" />
            <div className="auth-card">
                <div className="auth-logo">Azen<span>tix</span></div>
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
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
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
            </div>
        </div>
    );
};

export default Login;
