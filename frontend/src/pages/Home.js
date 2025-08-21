import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #ffeb3b 100%)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Conversational AI Coach',
      description: 'Have meaningful conversations with your personal AI coach that understands your journey and provides personalized guidance.',
      gradient: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 50%, #673ab7 100%)'
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
      gradient: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 50%, #cddc39 100%)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6"/>
          <path d="m4.2 4.2 4.2 4.2m5.2 5.2 4.2 4.2"/>
          <path d="M1 12h6m6 0h6"/>
          <path d="m4.2 19.8 4.2-4.2m5.2-5.2 4.2-4.2"/>
        </svg>
      ),
      title: 'Emotional Map',
      description: 'Explore your emotional landscape with interactive visualizations that connect your feelings and memories in meaningful ways.',
      gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 50%, #00bcd4 100%)'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="m7 16 3 3 3-3"/>
        </svg>
      ),
      title: 'Inspirational Quotes',
      description: 'Get personalized motivational quotes based on your emotions and save your favorites for daily inspiration and reflection.',
      gradient: 'linear-gradient(135deg, #ff9800 0%, #ff5722 50%, #f44336 100%)'
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
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #3f51b5 100%)'
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
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/login" className="btn btn-primary">Get Started</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
          `,
          opacity: 0.6
        }} />

        <div className="hero-content" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 24px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: '50px',
              padding: '8px 20px',
              marginBottom: '32px',
              color: '#4f46e5'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              Powered by Advanced AI Technology
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '24px',
              color: '#1e293b'
            }}
          >
            Your Digital
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Mind Palace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: '#64748b',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}
          >
            Discover the power of AI-guided self-reflection. We transform your daily thoughts and feelings into meaningful insights, 
            helping you understand patterns, unlock emotional intelligence, and create a personalized roadmap for your mental well-being.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link 
              to="/register" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(79, 70, 229, 0.25)';
              }}
            >
              <span>🚀</span>
              Start Your Journey
            </Link>
            <Link 
              to="/coaching" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                color: '#4f46e5',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '16px',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>🤖</span>
              Try AI Coach
            </Link>
          </motion.div>
        </div>

        {/* Subtle Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            fontSize: '1.2rem',
            opacity: 0.1,
            color: '#4f46e5'
          }}
        >
          🧠
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '70%',
            right: '12%',
            fontSize: '1rem',
            opacity: 0.1,
            color: '#7c3aed'
          }}
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '15%',
            fontSize: '1.1rem',
            opacity: 0.1,
            color: '#6366f1'
          }}
        >
          🗺️
        </motion.div>
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
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">AI-Powered Tools for Self-Discovery</h2>
            <p className="section-subtitle">
              Experience the future of personal development with intelligent features designed to unlock your emotional wisdom, 
              organize your thoughts, and guide your journey toward mental clarity and growth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
            <div className="card" style={{ 
              padding: '32px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.1)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 50%, #00bcd4 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="m4.2 4.2 4.2 4.2m5.2 5.2 4.2 4.2"/>
                  <path d="M1 12h6m6 0h6"/>
                  <path d="m4.2 19.8 4.2-4.2m5.2-5.2 4.2-4.2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
                Interactive Emotional Map
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Visualize your emotional journey with interactive maps that connect your feelings to memories, 
                helping you understand patterns and triggers in your mental well-being.
              </p>
            </div>

            <div className="card" style={{ 
              padding: '32px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
              border: '1px solid rgba(233, 30, 99, 0.1)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 50%, #673ab7 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(233, 30, 99, 0.3)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 9h8"/>
                  <path d="M8 13h6"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
                AI-Powered Coach
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Have meaningful conversations with your personal AI coach that understands your journey 
                and provides personalized guidance for emotional growth and self-discovery.
              </p>
            </div>

            <div className="card" style={{ 
              padding: '32px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 87, 34, 0.05) 100%)',
              border: '1px solid rgba(255, 152, 0, 0.1)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 50%, #f44336 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="m7 16 3 3 3-3"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
                Daily Inspiration Quotes
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Get personalized motivational quotes based on your current emotions and save your favorites 
                for daily inspiration and reflection on your personal growth journey.
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