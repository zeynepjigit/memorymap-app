import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DreamVisualization = () => {
  const [dreamText, setDreamText] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateVisualization = async () => {
    if (!dreamText.trim()) return;
    
    setLoading(true);
    
    // Simulate AI image generation
    setTimeout(() => {
      setGeneratedImage({
        url: 'https://via.placeholder.com/512x512/8b7cf6/ffffff?text=AI+Generated+Dream',
        prompt: dreamText,
        timestamp: new Date().toLocaleString()
      });
      setLoading(false);
    }, 3000);
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
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Dream Visualization</h1>
          <p className="section-subtitle">
            Transform your dreams and memories into beautiful AI-generated artwork
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Describe your dream or memory</label>
              <textarea
                className="form-input form-textarea"
                style={{ minHeight: '120px' }}
                placeholder="Describe your dream, memory, or any scene you'd like to visualize. Be as detailed as possible for better results..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                💡 Tip: Include details about colors, emotions, settings, and characters for more vivid visualizations.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={generateVisualization}
                className="btn btn-primary"
                disabled={!dreamText.trim() || loading}
              >
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <span>Generating artwork...</span>
                  </div>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    Generate Visualization
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedImage && (
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Your Generated Artwork
              </h3>
              
              <div style={{ 
                width: '100%', 
                height: '400px', 
                borderRadius: 'var(--radius-xl)', 
                background: 'var(--purple-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                AI Generated Dream Visualization
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Original Prompt:
                </div>
                <div style={{ 
                  background: 'var(--bg-tertiary)', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-lg)', 
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5'
                }}>
                  {generatedImage.prompt}
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Generated on: {generatedImage.timestamp}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamVisualization;