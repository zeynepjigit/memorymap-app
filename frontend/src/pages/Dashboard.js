import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEmotionalInsights, getDiaryEntries } from '../services/api';
import AnalysisCard from '../components/AnalysisCard';

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      const r = await getEmotionalInsights();
      if (r.success) setInsights(r.insights);
      const entries = await getDiaryEntries(6);
      if (entries.success) setRecent(entries.data.entries || []);
      setLoading(false);
    })();
  }, []);





  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/emotional-map" className="nav-link">Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link">Memories</Link></li>
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        {/* Welcome Section */}
        <div style={{ 
          marginBottom: '48px', 
          textAlign: 'center',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: '800', 
            marginBottom: '16px',
            color: '#1e293b'
          }}>
            Welcome back to your <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Memory Map</span>
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#64748b', 
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Ready to continue mapping your memories? Here's what's happening with your emotional journey and memory insights.
          </p>
          
          {/* Prominent Create Memory Button */}
          <Link 
            to="/diary-entry" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Create New Memory
          </Link>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                
                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: '900', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '12px',
                  lineHeight: '1'
                }}>
                  {insights.total_entries}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  marginBottom: '8px' 
                }}>
                  Memory Entries Created
                </h3>
                
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '0.95rem',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  Your personal collection of thoughts, experiences, and reflections mapped over time.
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#6366f1',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  Keep growing your memory map!
                </div>
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

        {/* Enhanced Emotional Patterns */}
        {insights?.emotion_distribution && (
          <div style={{ 
            marginTop: '48px',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.1)',
            borderRadius: '20px',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '8px', 
                color: '#1e293b' 
              }}>
                Your Emotional Patterns
              </h3>
              <p style={{ 
                color: '#64748b', 
                fontSize: '1rem', 
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Understanding your emotional landscape over time helps identify patterns and triggers in your mental well-being.
              </p>
            </div>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.entries(insights.emotion_distribution).map(([emotion, count], index) => {
                const percentage = (count / insights.total_entries) * 100;
                const emotionColors = {
                  'happy': '#FFD700',
                  'joy': '#FFD700', 
                  'excited': '#FF6B6B',
                  'love': '#FF69B4',
                  'calm': '#87CEEB',
                  'peaceful': '#98FB98',
                  'sad': '#4682B4',
                  'angry': '#DC143C',
                  'anxious': '#9370DB',
                  'worried': '#8B4513',
                  'neutral': '#808080',
                  'motivated': '#32CD32',
                  'positive': '#00CED1',
                  'negative': '#FF4500'
                };
                const emotionColor = emotionColors[emotion.toLowerCase()] || '#6366f1';
                const emotionEmojis = {
                  'happy': '😊',
                  'joy': '😄',
                  'excited': '🤩', 
                  'love': '💕',
                  'calm': '😌',
                  'peaceful': '🕊️',
                  'sad': '😢',
                  'angry': '😠',
                  'anxious': '😰',
                  'worried': '😟',
                  'neutral': '😐',
                  'motivated': '💪',
                  'positive': '✨',
                  'negative': '⚡'
                };
                const emotionEmoji = emotionEmojis[emotion.toLowerCase()] || '💭';
                
                return (
                  <div 
                    key={emotion} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '20px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '12px',
                      border: `1px solid ${emotionColor}20`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 25px ${emotionColor}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ 
                      fontSize: '1.5rem',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {emotionEmoji}
                    </div>
                    
                    <div style={{ 
                      minWidth: '120px', 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      textTransform: 'capitalize',
                      color: '#1e293b'
                    }}>
                      {emotion}
                    </div>
                    
                    <div style={{ 
                      flex: 1, 
                      background: '#f1f5f9', 
                      height: '12px', 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${emotionColor}80, ${emotionColor})`,
                          borderRadius: '6px',
                          transition: 'width 1s ease',
                          animation: `fillBar${index} 1s ease forwards`
                        }} 
                      />
                    </div>
                    
                    <div style={{ 
                      minWidth: '50px', 
                      fontSize: '1rem', 
                      fontWeight: '700', 
                      color: emotionColor,
                      textAlign: 'center'
                    }}>
                      {count}
                    </div>
                    
                    <div style={{ 
                      minWidth: '60px', 
                      fontSize: '0.9rem', 
                      color: '#64748b',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Link to Emotional Map */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link 
                to="/emotional-map"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(76, 175, 80, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.3)';
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="m4.2 4.2 4.2 4.2m5.2 5.2 4.2 4.2"/>
                  <path d="M1 12h6m6 0h6"/>
                  <path d="m4.2 19.8 4.2-4.2m5.2-5.2 4.2-4.2"/>
                </svg>
                Explore Interactive Emotional Map
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced Recent Memories */}
        {recent.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '32px'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  marginBottom: '8px', 
                  color: '#1e293b' 
                }}>
                  Recent Memories
                </h2>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Your latest thoughts, experiences, and reflections
                </p>
              </div>
              
              <Link 
                to="/memories"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  color: '#6366f1',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)';
                  e.target.style.color = '#6366f1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                View All Memories
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px' 
            }}>
              {recent.map((e, index) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Emotion indicator */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: e.analysis?.affect?.primary_emotions?.[0]?.label ? 
                      (() => {
                        const emotion = e.analysis.affect.primary_emotions[0].label.toLowerCase();
                        const colors = {
                          'happy': '#FFD700', 'joy': '#FFD700', 'excited': '#FF6B6B',
                          'love': '#FF69B4', 'calm': '#87CEEB', 'peaceful': '#98FB98',
                          'sad': '#4682B4', 'angry': '#DC143C', 'anxious': '#9370DB'
                        };
                        return colors[emotion] || '#6366f1';
                      })() : '#6366f1'
                  }} />
                  
                  <AnalysisCard entry={e} />
                </motion.div>
              ))}
            </div>
          </div>
        )}










      </div>
    </div>
  );
};

export default Dashboard;