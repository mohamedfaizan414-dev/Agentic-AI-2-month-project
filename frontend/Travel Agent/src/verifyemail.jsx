import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

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
            const response = await axios.post('https://express-backend-quh7.onrender.com/api/auth/verifyemail', {
                otp: fullCode
            });

            if (response.status === 200) {
                navigate('/chat');
            } else {
                const data = await response.data;
                setError(data.message || 'Invalid code.');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">Azentix<span className="gold-dot">.</span></div>

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
            </div>
        </div>
    );
};

export default VerifyEmail;