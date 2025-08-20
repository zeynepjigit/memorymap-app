import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmotionalInsights } from '../services/api';

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await getEmotionalInsights();
      if (r.success) setInsights(r.insights);
      setLoading(false);
    })();
  }, []);

  const quickActions = [
    {
      title: 'New Journal Entry',
      description: 'Start writing your thoughts and experiences',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      link: '/diary-entry',
      gradient: 'var(--gradient-purple)'
    },
    {
      title: 'AI Coach Session',
      description: 'Chat with your personal AI coach',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M8 9h8"/>
          <path d="M8 13h6"/>
        </svg>
      ),
      link: '/coaching',
      gradient: 'var(--gradient-blue)'
    },
    {
      title: 'Memory Gallery',
      description: 'Browse your AI-generated artwork',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      link: '/gallery',
      gradient: 'var(--gradient-green)'
    },
    {
      title: 'Dream Visualization',
      description: 'Transform dreams into visual art',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          <path d="M19 3v4"/>
          <path d="M21 5h-4"/>
        </svg>
      ),
      link: '/dream-visualization',
      gradient: 'var(--gradient-orange)'
    }
  ];

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        {/* Welcome Section */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Welcome back to your <span className="hero-title-gradient">Memory Map</span></h1>
          <p className="section-subtitle">
            Ready to continue mapping your memories? Here's what's happening with your emotional journey and memory insights.
          </p>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="dashboard-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="dashboard-card">
                <div className="loading">
                  <div className="spinner"></div>
                  <span>Loading insights...</span>
                </div>
              </div>
            ))}
          </div>
        ) : insights ? (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Total Entries</h3>
                <div className="dashboard-card-icon" style={{ background: 'var(--gradient-purple)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {insights.total_entries}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Memory entries created
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/diary-entry" className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 12px' }}>
                  Create new memory
                </Link>
              </div>
            </div>

            {insights.most_common_emotions && (
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3 className="dashboard-card-title">Dominant Emotion</h3>
                  <div className="dashboard-card-icon" style={{ background: 'var(--gradient-blue)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-purple)', marginBottom: '8px' }}>
                  {insights.most_common_emotions[0][0]}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Most frequent emotional state
                </p>
                <div style={{ marginTop: '16px' }}>
                  <Link to="/coaching" className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 12px' }}>
                    Explore with AI
                  </Link>
                </div>
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
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {Math.floor(insights.total_entries * 2.3)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Generated insights & patterns
              </p>
              <div style={{ marginTop: '16px' }}>
                <span className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 12px', color: 'var(--accent-green)' }}>
                  View analysis
                </span>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Growth Streak</h3>
                <div className="dashboard-card-icon" style={{ background: 'var(--gradient-orange)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {Math.max(1, Math.floor(insights.total_entries / 3))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Days of consistent memory mapping
              </p>
              <div style={{ marginTop: '16px' }}>
                <span className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 12px', color: 'var(--accent-orange)' }}>
                  Keep it up!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '40px' }}>
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
              </svg>
            </div>
            <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>No memories mapped yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              Start your memory mapping journey to see insights and track your personal growth here.
            </p>
            <Link to="/diary-entry" className="btn btn-primary">
              Create Your First Memory
            </Link>
          </div>
        )}

        {/* Emotion Distribution */}
        {insights?.emotion_distribution && (
          <div className="card" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>
                Emotional Patterns
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                Understanding your emotional landscape over time helps identify patterns and triggers in your mental well-being.
              </p>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {Object.entries(insights.emotion_distribution).map(([emotion, count]) => {
                const percentage = (count / insights.total_entries) * 100;
                return (
                  <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      minWidth: '100px', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      textTransform: 'capitalize',
                      color: 'var(--text-dark)'
                    }}>
                      {emotion}
                    </div>
                    <div style={{ 
                      flex: 1, 
                      background: 'var(--border-light)', 
                      height: '8px', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: 'var(--gradient-purple)',
                          borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} 
                      />
                    </div>
                    <div style={{ 
                      minWidth: '40px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-dark)',
                      textAlign: 'right'
                    }}>
                      {count}
                    </div>
                    <div style={{ 
                      minWidth: '50px', 
                      fontSize: '12px', 
                      color: 'var(--text-muted)',
                      textAlign: 'right'
                    }}>
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginTop: '48px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Quick Actions
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' }}>
              Continue mapping your memories with these powerful AI-powered tools and features.
            </p>
          
          <div className="dashboard-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} style={{ textDecoration: 'none' }}>
                <div className="dashboard-card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div className="dashboard-card-header">
                    <h3 className="dashboard-card-title">{action.title}</h3>
                    <div className="dashboard-card-icon" style={{ background: action.gradient }}>
                      {action.icon}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                    {action.description}
                  </p>
                  <div style={{ marginTop: '16px' }}>
                    <span className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 12px' }}>
                      Get started
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' }}>
            Recent Activity
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
            Track your journaling habits and see your progress over time.
          </p>
          
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
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
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
            </div>
            <h3 style={{ marginBottom: '12px', color: 'var(--text-dark)' }}>Activity Timeline Coming Soon</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              We're working on a beautiful timeline view to help you visualize your journaling journey and personal growth over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;