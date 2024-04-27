import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../img/pp.png';
import './css/login.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getIsAuthenticated = useCallback(async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_API_URI+"/getUserData", { withCredentials: true });
            console.log(res);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }, [navigate]);

    useEffect(() => {
        getIsAuthenticated();
    }, [getIsAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post( process.env.REACT_APP_API_URI+'/login', {
                username,
                password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                window.location.href = '/';
                navigate('/');  // Redirect on successful login
            } else {
                throw new Error('Login failed');
            }
        } catch (err) {
            setError(err.response?.data.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    const handleSignUp = () => {
        navigate('/sign-up'); // Redirect to sign-up page
    };
    return (
        <div className="login-container">
            <img src={Logo} alt="Logo" className="logo" />
            <h2>Reconnect By Logging In</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="login-button btn btn-success" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login in'}
                </button>
                <button onClick={handleSignUp} className="sign-button btn btn-info" disabled={loading}>
                Sign Up
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
