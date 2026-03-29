import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
     const AgentUrl = 'https://agent-backend-3s9n.onrender.com'
    const BackendUrl = 'https://express-backend-quh7.onrender.com'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adjust the URL to match your Express signup route
            const response = await axios.post(`${BackendUrl}/api/auth/register`, formData);
            
            if (response.status === 201 || response.status === 200) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div id='div-reg'>
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={{ marginBottom: '10px', color: '#fcfcfc' }}>Create Account</h2>
                <p style={{ color: '#fffefe', marginBottom: '20px' }}>Join the Travel Agent AI</p>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                {message && <p style={styles.feedback}>{message}</p>}
                
                <p style={{ marginTop: '15px', fontSize: '14px', color: '#ffffff' }}>
                    Already have an account? <a href="/login" style={{ color: '#007bff' }}>Login here</a>
                </p>
            </div>
        </div>
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000000',color: '#fff' },
    card: { width: '400px', padding: '40px',  background: '#171717', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #807979', fontSize: '16px', backgroundColor: '#171717', color: '#FFFFFF' },
    button: { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    feedback: { marginTop: '15px', color: '#2ce356', fontWeight: '500' }
};

export default Register;