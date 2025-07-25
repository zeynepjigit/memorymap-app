import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', formData);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome Back</h1>
      <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        Sign in to continue your journey with MemoryMap
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
          Sign In
        </button>
      </form>
      
      <p className="text-center">
        Don't have an account? <Link to="/register">Create one here</Link>
      </p>
    </div>
  );
};

export default Login; 