import React, { useState, useEffect } from 'react';
import './QuoteCard.css';

const QuoteCard = ({ 
  quote, 
  author, 
  emotion, 
  colors, 
  timestamp, 
  onClose, 
  onSave,
  isVisible = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleSave = () => {
    setIsSaved(true);
    if (onSave) {
      onSave({ quote, author, emotion, colors, timestamp });
    }
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  const cardStyle = {
    background: `linear-gradient(135deg, ${colors?.background || '#F5F5F5'} 0%, ${colors?.accent || '#D3D3D3'} 100%)`,
    border: `2px solid ${colors?.primary || '#708090'}`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px ${colors?.primary || '#708090'}40`
  };

  const quoteStyle = {
    color: colors?.text || '#2F4F4F'
  };

  const authorStyle = {
    color: colors?.secondary || '#A9A9A9'
  };

  return (
    <div className={`quote-card ${isAnimating ? 'quote-card-enter' : ''}`} style={cardStyle}>
      {/* Decorative elements */}
      <div className="quote-card-decoration">
        <div 
          className="quote-card-accent" 
          style={{ backgroundColor: colors?.primary || '#708090' }}
        />
        <div 
          className="quote-card-pattern" 
          style={{ background: `linear-gradient(45deg, ${colors?.secondary || '#A9A9A9'}20 25%, transparent 25%, transparent 75%, ${colors?.secondary || '#A9A9A9'}20 75%)` }}
        />
      </div>

      {/* Main content */}
      <div className="quote-card-content">
        {/* Quote icon */}
        <div className="quote-icon" style={{ color: colors?.primary || '#708090' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
          </svg>
        </div>

        {/* Quote text */}
        <blockquote className="quote-text" style={quoteStyle}>
          "{quote}"
        </blockquote>

        {/* Author */}
        <cite className="quote-author" style={authorStyle}>
          — {author}
        </cite>

        {/* Emotion badge */}
        {emotion && (
          <div className="quote-emotion-badge" style={{ backgroundColor: colors?.secondary || '#A9A9A9' }}>
            {emotion}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className="quote-timestamp" style={{ color: colors?.secondary || '#A9A9A9' }}>
            {formatTimestamp(timestamp)}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="quote-card-actions">
        <button 
          className={`quote-action-btn save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
          style={{ 
            backgroundColor: isSaved ? '#4CAF50' : colors?.primary || '#708090',
            color: 'white'
          }}
        >
          {isSaved ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Saved!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              Save
            </>
          )}
        </button>

        {onClose && (
          <button 
            className="quote-action-btn close-btn"
            onClick={onClose}
            style={{ 
              backgroundColor: 'transparent',
              color: colors?.text || '#2F4F4F',
              border: `1px solid ${colors?.primary || '#708090'}`
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="quote-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="quote-particle"
            style={{ 
              backgroundColor: colors?.accent || '#D3D3D3',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteCard;
