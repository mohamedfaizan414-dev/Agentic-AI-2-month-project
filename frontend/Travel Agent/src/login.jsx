import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const Login = () => {

    // We use "identifier" to represent either the username or the email
    const [formData, setFormData] = useState({
        identifier: '', 
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Your logic requires {username, email, password}
            // We send the same 'identifier' to both fields so the $or logic works
            const payload = {
                username: formData.identifier,
                email: formData.identifier,
                password: formData.password
            };

            const response = await axios.post('https://travel-agent-ltzc.onrender.com/api/auth/login', payload, {
                withCredentials: true // This is REQUIRED to receive the cookie from res.cookie()
                
            });
            localStorage.setItem("token",response.data.token)

            if (response.status === 200) {
                console.log('Login Success:', response.data.user);
                navigate('/chat'); // Redirect to your chat/agent page
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username/email or password');
        }
    };

    return (
        <div id='div-lgn'>
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                    style={styles.input}
                        type="text"
                        name="identifier"
                        placeholder="Username or Email"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                        
                    />
                    <input
                    style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        
                    />
                    {error && <p style={styles.errorText}>{error}</p>}
                    <button type="submit" style={styles.button}>Sign In</button>
                </form>
                <p style={styles.footer}>
                    New here? <a href="/register"  style={{ color: '#007bff' }}>Create an account</a>
                </p>
            </div>
        </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0A0A0A' },
    card: { width: '380px', padding: '30px', background: '#171717', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#FFFFFF' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { backgroundColor: '#171717', color: '#FFFFFF', padding: '12px', marginBottom: '15px', border: '1px solid #807979', borderRadius: '5px' },
    button: { padding: '12px', background: '#28a745', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600' },
    errorText: { color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' },
    footer: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};

export default Login;