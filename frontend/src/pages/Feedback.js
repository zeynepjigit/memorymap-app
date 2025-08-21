import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Feedback = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratings = [
    { value: 1, label: 'Poor', color: '#ef4444' },
    { value: 2, label: 'Fair', color: '#f97316' },
    { value: 3, label: 'Good', color: '#eab308' },
    { value: 4, label: 'Very Good', color: '#22c55e' },
    { value: 5, label: 'Excellent', color: '#10b981' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
            <li><Link to="/emotional-map" className="nav-link">Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link">Memories</Link></li>
            <li><Link to="/quotes" className="nav-link">Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Share Your Feedback</h1>
          <p className="section-subtitle">
            Help us improve MemoryMap by sharing your thoughts and experiences
          </p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {submitted ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: 'var(--radius-2xl)', 
                background: 'var(--accent-green)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>
                Thank you for your feedback!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Your feedback has been submitted successfully. We appreciate your input and will use it to improve MemoryMap.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  How would you rate your experience with MemoryMap?
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                  {ratings.map((rating) => (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={() => setSelectedRating(rating.value)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-full)',
                        border: selectedRating === rating.value ? `3px solid ${rating.color}` : '2px solid var(--gray-200)',
                        background: selectedRating === rating.value ? rating.color : 'var(--bg-primary)',
                        color: selectedRating === rating.value ? 'white' : 'var(--text-secondary)',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {rating.value}
                    </button>
                  ))}
                </div>
                
                {selectedRating > 0 && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ 
                      color: ratings[selectedRating - 1].color, 
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      {ratings[selectedRating - 1].label}
                    </span>
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Additional Comments (Optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    style={{ minHeight: '120px' }}
                    placeholder="Tell us more about your experience, suggestions for improvement, or any issues you encountered..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Link to="/dashboard" className="btn btn-secondary">
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={selectedRating === 0}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;