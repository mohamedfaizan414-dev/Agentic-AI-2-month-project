import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { api } from './api.js';

const VerifyEmail = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus next input
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const code = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!code) return;
        e.preventDefault();
        setOtp(code.padEnd(6, ' ').split('').map((character) => character.trim()));
        inputRefs.current[Math.min(code.length, 5)]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const fullCode = otp.join('');
        
        if (fullCode.length < 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const email = sessionStorage.getItem('verificationEmail');
            if (!email) throw new Error('Please register again before verifying your email.');
            const response = await api.post('/api/auth/verifyemail', { otp: fullCode, email });

            if (response.status === 200) {
                navigate('/login');
            } else {
                const data = await response.data;
                setError(data.message || 'Invalid code.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap auth-split">
            <section className="auth-showcase">
                <div className="auth-brand">Azen<span>tix</span></div>
                <span className="eyebrow">ONE LAST STEP</span>
                <h1>Confirm your<br /><em>passport to wander.</em></h1>
                <p>We protect every saved plan, preference, and travel memory.</p>
            </section>
            <section className="auth-card">
                <div className="auth-logo">Azen<span className="gold-dot">tix</span></div>

                <div className="auth-header">
                    <h1>Verify Email</h1>
                    <p>Enter the code sent to your inbox</p>
                </div>

                <form onSubmit={handleVerify} className="auth-form">
                    <label className="input-label">VERIFICATION CODE</label>
                    <div className="otp-bubble-group">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="otp-bubble"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                required
                            />
                        ))}
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Checking...' : 'Verify Journey'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>New here? <span className="gold-link">Create an account</span></p>
                </div>
            </section>
        </div>
    );
};

export default VerifyEmail;
