import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy users with different roles
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'manager', password: 'manager123', role: 'manager', name: 'Manager User' },
    { username: 'analyst', password: 'analyst123', role: 'analyst', name: 'Analyst User' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    
    if (user) {
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        username: user.username,
        role: user.role,
        name: user.name
      }));
      
      // Call the onLogin callback
      onLogin(user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dashboard AI</h1>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="login-button">Sign In</button>
          </div>
        </form>
        
        <div className="login-help">
          <p>Demo Accounts:</p>
          <ul>
            <li>Admin: admin / admin123</li>
            <li>Manager: manager / manager123</li>
            <li>Analyst: analyst / analyst123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login; 