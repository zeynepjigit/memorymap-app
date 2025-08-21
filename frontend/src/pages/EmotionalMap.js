import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmotionalInsights, getDiaryEntries } from '../services/api';
import { motion } from 'framer-motion';

const EmotionalMap = () => {
  const [insights, setInsights] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [insightsResult, entriesResult] = await Promise.all([
        getEmotionalInsights(),
        getDiaryEntries(50)
      ]);
      
      if (insightsResult.success) {
        setInsights(insightsResult.insights);
      }
      
      if (entriesResult.success) {
        setEntries(entriesResult.data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load emotional data:', error);
    }
    setLoading(false);
  };

  const getEmotionColor = (emotion) => {
    const colorMap = {
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
      'confused': '#DDA0DD',
      'grateful': '#32CD32',
      'hopeful': '#00CED1'
    };
    return colorMap[emotion?.toLowerCase()] || '#808080';
  };

  const getEmotionSize = (count, maxCount) => {
    const minSize = 40;
    const maxSize = 120;
    return minSize + (count / maxCount) * (maxSize - minSize);
  };

  const renderEmotionalNetwork = () => {
    if (!insights?.emotion_distribution) return null;

    const emotions = Object.entries(insights.emotion_distribution);
    const maxCount = Math.max(...emotions.map(([, count]) => count));
    
    return (
      <div className="emotional-network">
        <svg width="100%" height="500" viewBox="0 0 800 500">
          <defs>
            <radialGradient id="emotionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </radialGradient>
          </defs>
          
          {emotions.map(([emotion, count], index) => {
            const angle = (index / emotions.length) * 2 * Math.PI;
            const radius = 180;
            const x = 400 + radius * Math.cos(angle);
            const y = 250 + radius * Math.sin(angle);
            const size = getEmotionSize(count, maxCount);
            const color = getEmotionColor(emotion);
            
            return (
              <g key={emotion}>
                {/* Connection lines to center */}
                <line
                  x1="400"
                  y1="250"
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  opacity={selectedEmotion === emotion ? 1 : 0.3}
                />
                
                {/* Emotion node */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={size / 2}
                  fill={color}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEmotion(selectedEmotion === emotion ? null : emotion)}
                  opacity={selectedEmotion && selectedEmotion !== emotion ? 0.5 : 1}
                />
                
                {/* Emotion label */}
                <text
                  x={x}
                  y={y + size / 2 + 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  style={{ textTransform: 'capitalize' }}
                >
                  {emotion}
                </text>
                
                {/* Count label */}
                <text
                  x={x}
                  y={y + size / 2 + 35}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="12"
                >
                  {count} entries
                </text>
              </g>
            );
          })}
          
          {/* Center node */}
          <circle
            cx="400"
            cy="250"
            r="30"
            fill="url(#emotionGlow)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="3"
          />
          <text
            x="400"
            y="255"
            textAnchor="middle"
            fill="#333"
            fontSize="14"
            fontWeight="700"
          >
            You
          </text>
        </svg>
      </div>
    );
  };

  const getRelatedEntries = (emotion) => {
    return entries.filter(entry => {
      const entryEmotion = entry?.analysis?.affect?.primary_emotions?.[0]?.label || entry?.mood || '';
      return entryEmotion.toLowerCase().includes(emotion.toLowerCase());
    });
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/emotional-map" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link">Memories</Link></li>
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">
            Your <span className="hero-title-gradient">Emotional Map</span>
          </h1>
          <p className="section-subtitle">
            Explore the interconnected landscape of your emotions and discover patterns in your mental well-being journey.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div className="loading">
              <div className="spinner"></div>
              <span>Loading your emotional landscape...</span>
            </div>
          </div>
        ) : !insights?.emotion_distribution ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>No emotional data yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Start creating diary entries to build your emotional map and discover patterns in your feelings.
            </p>
            <Link to="/diary-entry" className="btn btn-primary">
              Create Your First Entry
            </Link>
          </div>
        ) : (
          <>
            {/* Interactive Emotional Network */}
            <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                  Interactive Emotional Network
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                  Click on any emotion to explore related memories and entries
                </p>
              </div>
              {renderEmotionalNetwork()}
            </div>

            {/* Selected Emotion Details */}
            {selectedEmotion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ marginTop: '32px' }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)', textTransform: 'capitalize' }}>
                    {selectedEmotion} Memories
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    Explore entries associated with {selectedEmotion} emotions
                  </p>
                </div>

                <div className="dashboard-grid">
                  {getRelatedEntries(selectedEmotion).slice(0, 6).map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="dashboard-card"
                      style={{ cursor: 'pointer' }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date'}
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                          {entry.title || 'Untitled Entry'}
                        </h4>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {entry.content ? entry.content.slice(0, 120) + '...' : 'No content available'}
                      </p>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getEmotionColor(selectedEmotion)
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {selectedEmotion}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {getRelatedEntries(selectedEmotion).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No entries found for {selectedEmotion} emotion
                  </div>
                )}
              </motion.div>
            )}

            {/* Emotional Insights */}
            <div className="card" style={{ marginTop: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>
                  Emotional Insights
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  Understanding your emotional patterns over time
                </p>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)' }}>
                    Most Frequent Emotion
                  </h4>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-purple)', textTransform: 'capitalize' }}>
                    {insights.most_common_emotions?.[0]?.[0] || 'Unknown'}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)' }}>
                    Emotional Diversity
                  </h4>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)' }}>
                    {Object.keys(insights.emotion_distribution || {}).length}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Different emotions experienced</p>
                </div>

                <div className="dashboard-card">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-dark)' }}>
                    Total Entries
                  </h4>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-green)' }}>
                    {insights.total_entries || 0}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Memory entries analyzed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmotionalMap;
