import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Set body class for login page
        document.body.className = 'login-body';

        // Clean up function to remove class when component unmounts
        return () => {
            document.body.className = '';
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5148/api/Auth/login', {
                email,
                password,
            });

            const { token, role, username, userId } = response.data;

            // Store user information in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);

            // Navigate based on user role
            if (role === 'Admin') {
                navigate('/admin-dashboard');
            } else if (role === 'Professor') {
                navigate('/professor-dashboard');
            } else {
                navigate('/student-dashboard/profile');
            }
        } catch (err) {
            setError('Invalid credentials or your account has not been approved.');
        }
    };

    const handleCreateAccount = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h1 className="login-title">ShivaEUniversity</h1>
            <div className="login-card">
                <h2 className="login-heading">Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                {error && <p className="login-error">{error}</p>}
                <div className="create-account-container">
                    <p>Don't have an account?</p>
                    <button onClick={handleCreateAccount} className="create-account-button">
                        Create New Account
                    </button>
                </div>
                <div className="login-footer">
                    <p>© 2024 ShivaEUniversity. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
