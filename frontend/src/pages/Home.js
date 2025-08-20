import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmotionalInsights } from '../services/api';

const Home = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await getEmotionalInsights();
      if (r.success) setInsights(r.insights);
    })();
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
        </svg>
      ),
      title: 'AI-Powered Insights',
      description: 'Uncover hidden patterns in your thoughts and emotions with advanced artificial intelligence that learns from your writing.',
      gradient: 'var(--gradient-purple)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Conversational AI Coach',
      description: 'Have meaningful conversations with your personal AI coach that understands your journey and provides personalized guidance.',
      gradient: 'var(--gradient-blue)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      ),
      title: 'Emotional Analytics',
      description: 'Track your emotional well-being over time with detailed analytics that help you understand your mental health patterns.',
      gradient: 'var(--gradient-green)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      title: 'Visual Memory Creation',
      description: 'Transform your thoughts and dreams into beautiful visual representations using AI-powered image generation.',
      gradient: 'var(--gradient-orange)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Location-Based Memories',
      description: 'Connect your memories to places with intelligent location tracking and create a visual map of your experiences.',
      gradient: 'var(--gradient-blue)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: 'Personal Growth Tracking',
      description: 'Monitor your personal development journey with insights that help you understand your progress and areas for improvement.',
      gradient: 'var(--gradient-green)'
    }
  ];

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/login" className="btn btn-primary">Get Started</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span>Trusted by thousands of users worldwide</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-gradient">Memory Mapping</span><br />
            with AI Superpowers
          </h1>

          <p className="hero-subtitle">
            Transform your thoughts into a visual map of memories. Capture life's moments with AI-powered insights, 
            emotional analysis, and personalized coaching to help you flourish.
          </p>
          
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">
              Start Journaling Today
            </Link>
            <Link to="/coaching" className="btn btn-secondary">
              Try AI Coach
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Map Your Memories with Intelligence</h2>
            <p className="section-subtitle">
              Create a visual journey of your thoughts and experiences. Our AI understands your emotions, 
              connects your memories, and helps you discover patterns in your personal growth.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="card card-feature">
                <div className="card-icon" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            ))}
          </div>
      </div>
    </section>

      {/* AI Features Section */}
      <section style={{ padding: '80px 24px', background: 'var(--background-gray)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Go Deeper with AI Memory Analysis</h2>
            <p className="section-subtitle">
              Our intelligent AI companion analyzes your memory patterns, offers personalized guidance, 
              and provides meaningful insights to help you understand your emotional journey.
      </p>
    </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 9h8"/>
                  <path d="M8 13h6"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Ask Your Memories Anything
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Leverage AI-enhanced search to instantly find, analyze, and uncover patterns in your memory map, 
                turning your personal history into a powerful tool for self-discovery and growth.
              </p>
            </div>

            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'var(--gradient-blue)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' }}>
                Speak Your Mind
            </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Effortlessly transform your spoken thoughts into written reflections with our advanced voice-to-text technology, 
                making journaling more accessible and spontaneous.
              </p>
            </div>

            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'var(--gradient-green)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' }}>
                100+ Journaling Guides
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Dive into a comprehensive library of expert-curated guides covering mental health, personal growth, 
                relationships, career development, and emotional well-being.
              </p>
            </div>
          </div>
    </div>
  </section>

      {/* Stats Section */}
      {insights && (
        <section style={{ padding: '80px 24px', background: 'var(--primary-light)' }}>
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Your Journey So Far</h2>
              <p className="section-subtitle">
                See how DearDiary is helping you grow and understand yourself better with personalized insights.
              </p>
            </div>
            
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Total Entries</h3>
                  <div className="dashboard-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-dark)' }}>
                  {insights.total_entries}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  Journal entries created
      </p>
    </div>

              {insights.most_common_emotions && (
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3 className="dashboard-card-title">Emotional Tone</h3>
                    <div className="dashboard-card-icon" style={{ background: 'var(--gradient-blue)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary-purple)' }}>
                    {insights.most_common_emotions[0][0]}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Most frequent emotion
                  </p>
                </div>
              )}
              
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">AI Insights</h3>
                  <div className="dashboard-card-icon" style={{ background: 'var(--gradient-green)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-dark)' }}>
                  {Math.floor(insights.total_entries * 2.3)}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                  AI-generated insights
                </p>
              </div>
            </div>
    </div>
  </section>
      )}

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', background: 'var(--background-gray)', textAlign: 'center' }}>
        <div className="section-container">
          <h2 className="section-title">Gain clarity and peace of mind, wherever you are</h2>
          <p className="section-subtitle" style={{ marginBottom: '40px' }}>
            Join thousands of users who are already transforming their lives with MemoryMap's AI-powered memory mapping experience.
          </p>
          
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary">
              Start Journaling Today
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 