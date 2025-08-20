import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Demo login
    if (formData.email === 'demo@example.com' && formData.password === 'demo123') {
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setError('Invalid credentials. Use demo@example.com / demo123 for demo access.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/register" className="btn btn-primary">Sign Up</Link></li>
          </ul>
        </div>
      </nav>

      <div className="form-container">
        <div className="form-header">
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: 'var(--radius-2xl)', 
            background: 'var(--gradient-purple)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 className="form-title">Welcome back</h1>
          <p className="form-subtitle">Sign in to your MemoryMap account to continue your memory mapping journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{ 
              background: '#FEF2F2', 
              border: '1px solid #FECACA', 
              color: '#DC2626', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-lg)', 
              fontSize: '14px',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '24px' }}
            disabled={loading}
          >
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link to="/forgot-password" style={{ 
              color: 'var(--primary-purple)', 
              textDecoration: 'none', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Forgot your password?
            </Link>
          </div>

          <div style={{ 
            background: 'var(--background-gray)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--gradient-blue)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0', color: 'var(--text-dark)' }}>
                Demo Account
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
              Try MemoryMap with our demo account to explore all features:
            </p>
            <div style={{ 
              fontSize: '13px', 
              fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', 
              background: 'var(--primary-light)', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-light)',
              lineHeight: '1.4'
            }}>
              <div style={{ color: 'var(--text-muted)' }}>Email:</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: '600' }}>demo@example.com</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Password:</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: '600' }}>demo123</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Don't have an account?{' '}
            </span>
            <Link to="/register" style={{ 
              color: 'var(--primary-purple)', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Sign up
            </Link>
          </div>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link to="/" style={{ 
            color: 'var(--text-muted)', 
            textDecoration: 'none', 
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;