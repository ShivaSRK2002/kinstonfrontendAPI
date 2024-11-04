import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the updated CSS

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Set body class when the component is mounted
    document.body.className = 'register-body';

    // Clean up the body class when the component unmounts
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const isActive = role === 'Admin' ? true : false;

    try {
      await axios.post('http://localhost:5148/api/Auth/register', {
        name: name,
        email: email,
        passwordHash: passwordHash,
        role: role,
        isActive: isActive,
      });

      setSuccess('Registration successful! Awaiting admin approval.');
      setError('');

      // Navigate to the homepage after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);

        const errorMessages = err.response.data.errors 
          ? Object.values(err.response.data.errors).flat().join(' ') 
          : 'Registration failed. Please try again.';
        setError(errorMessages);
      } else {
        setError('Network error occurred. Please try again later.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={passwordHash}
          onChange={(e) => setPasswordHash(e.target.value)}
          required
          className="input-field"
        />
        <div className="role-selection">
          <label>
            <input
              type="radio"
              value="Student"
              checked={role === 'Student'}
              onChange={(e) => setRole(e.target.value)}
              className="role-radio"
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              value="Professor"
              checked={role === 'Professor'}
              onChange={(e) => setRole(e.target.value)}
              className="role-radio"
            />
            Professor
          </label>
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
