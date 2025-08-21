import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateInspirationalQuote, getQuoteHistory } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Quotes = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('NEUTRAL');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'saved'
  const [favoriteQuotes, setFavoriteQuotes] = useState(new Set());

  const emotions = [
    { value: 'HAPPY', label: 'Happy', color: '#FFD700', emoji: '😊' },
    { value: 'PEACEFUL', label: 'Peaceful', color: '#98FB98', emoji: '🕊️' },
    { value: 'MOTIVATED', label: 'Motivated', color: '#FF6B6B', emoji: '🔥' },
    { value: 'GRATEFUL', label: 'Grateful', color: '#32CD32', emoji: '🙏' },
    { value: 'REFLECTIVE', label: 'Reflective', color: '#87CEEB', emoji: '🤔' },
    { value: 'HOPEFUL', label: 'Hopeful', color: '#00CED1', emoji: '🌟' },
    { value: 'CALM', label: 'Calm', color: '#DDA0DD', emoji: '🧘' },
    { value: 'NEUTRAL', label: 'Neutral', color: '#808080', emoji: '😐' }
  ];

  useEffect(() => {
    loadSavedQuotes();
    loadFavorites();
  }, []);

  const loadSavedQuotes = async () => {
    try {
      const result = await getQuoteHistory(50);
      if (result.success) {
        setSavedQuotes(result.data.quotes || []);
      }
    } catch (error) {
      console.error('Failed to load saved quotes:', error);
    }
  };

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('favoriteQuotes');
      if (saved) {
        setFavoriteQuotes(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('favoriteQuotes', JSON.stringify([...newFavorites]));
      setFavoriteQuotes(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const generateQuote = async () => {
    if (!selectedEmotion) {
      alert('Please select an emotion first.');
      return;
    }

    setLoading(true);
    try {
      const result = await generateInspirationalQuote({
        emotion: selectedEmotion,
        diary_content: customPrompt
      });

      if (result.success) {
        const quoteWithId = {
          ...result.data,
          id: Date.now(),
          generated_at: new Date().toISOString()
        };
        setCurrentQuote(quoteWithId);
        // Refresh saved quotes to include the new one
        setTimeout(() => loadSavedQuotes(), 1000);
      } else {
        alert('Failed to generate quote: ' + result.error);
      }
    } catch (error) {
      console.error('Quote generation error:', error);
      alert('Failed to generate quote: ' + error.message);
    }
    setLoading(false);
  };

  const toggleFavorite = (quoteId) => {
    const newFavorites = new Set(favoriteQuotes);
    if (newFavorites.has(quoteId)) {
      newFavorites.delete(quoteId);
    } else {
      newFavorites.add(quoteId);
    }
    saveFavorites(newFavorites);
  };

  const copyQuote = (quote) => {
    const text = `"${quote.quote}" - ${quote.author || 'Anonymous'}`;
    navigator.clipboard.writeText(text).then(() => {
      // Show a temporary success message
      const button = document.activeElement;
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        if (button) button.textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const getEmotionData = (emotion) => {
    return emotions.find(e => e.value === emotion) || emotions[emotions.length - 1];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/emotional-map" className="nav-link">Emotional Map</Link></li>
            <li><Link to="/memories" className="nav-link">Memories</Link></li>
            <li><Link to="/quotes" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Quotes</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-header" 
          style={{ marginBottom: '40px' }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="section-title"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
          >
            Inspirational{' '}
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              className="hero-title-gradient"
              style={{ fontWeight: '800' }}
            >
              Quotes
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="section-subtitle"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            Generate personalized motivational quotes based on your emotions and save your favorites for daily inspiration.
          </motion.p>
          
          {/* Floating decorative elements */}
          <motion.div
            animate={{ 
              y: [-8, 8, -8],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              fontSize: '2rem',
              opacity: 0.1,
              color: '#8b7cf6'
            }}
          >
            💫
          </motion.div>
          <motion.div
            animate={{ 
              y: [8, -8, 8],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              fontSize: '1.5rem',
              opacity: 0.1,
              color: '#f472b6'
            }}
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="tabs-header" 
          style={{ 
            marginBottom: '32px',
            position: 'relative',
            display: 'flex',
            gap: '8px',
            padding: '4px',
            background: 'rgba(139, 124, 246, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 124, 246, 0.1)',
            maxWidth: '400px',
            margin: '0 auto 32px'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
            style={{
              flex: 1,
              position: 'relative',
              background: activeTab === 'generate' 
                ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                : 'transparent',
              color: activeTab === 'generate' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'generate' 
                ? '0 4px 12px rgba(139, 124, 246, 0.3)'
                : 'none'
            }}
          >
            <motion.span
              animate={activeTab === 'generate' ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              ✨
            </motion.span>
            Generate New Quote
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
            style={{
              flex: 1,
              position: 'relative',
              background: activeTab === 'saved' 
                ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                : 'transparent',
              color: activeTab === 'saved' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'saved' 
                ? '0 4px 12px rgba(139, 124, 246, 0.3)'
                : 'none'
            }}
          >
            <motion.span
              animate={activeTab === 'saved' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              💾
            </motion.span>
            Saved Quotes
            {savedQuotes.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  background: activeTab === 'saved' 
                    ? 'rgba(255, 255, 255, 0.3)'
                    : '#8b7cf6',
                  color: activeTab === 'saved' ? 'white' : 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  minWidth: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {savedQuotes.length}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {activeTab === 'generate' ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Quote Generator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="card" 
              style={{ marginBottom: '32px' }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ marginBottom: '32px' }}
              >
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-dark)' }}>
                  Generate Personalized Quote
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.5' }}>
                  Select your current emotion and optionally add context for a more personalized quote.
                </p>
              </motion.div>

              {/* Enhanced Emotion Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ marginBottom: '32px' }}
              >
                <label style={{ 
                  display: 'block', 
                  marginBottom: '20px', 
                  fontWeight: '600', 
                  color: 'var(--text-dark)',
                  fontSize: '18px'
                }}>
                  How are you feeling?
                </label>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                  gap: '16px' 
                }}>
                  {emotions.map((emotion, index) => (
                    <motion.button
                      key={emotion.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        boxShadow: `0 8px 25px ${emotion.color}40`
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      style={{
                        padding: '16px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        background: selectedEmotion === emotion.value 
                          ? `linear-gradient(135deg, ${emotion.color}20 0%, ${emotion.color}10 100%)`
                          : 'white',
                        border: selectedEmotion === emotion.value 
                          ? `2px solid ${emotion.color}`
                          : '2px solid #f1f5f9',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: selectedEmotion === emotion.value 
                          ? `0 4px 20px ${emotion.color}30`
                          : '0 2px 10px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedEmotion !== emotion.value) {
                          e.target.style.background = `linear-gradient(135deg, ${emotion.color}10 0%, ${emotion.color}05 100%)`;
                          e.target.style.borderColor = emotion.color + '60';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedEmotion !== emotion.value) {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#f1f5f9';
                        }
                      }}
                    >
                      {/* Animated background for selected state */}
                      {selectedEmotion === emotion.value && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.1 }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle, ${emotion.color} 0%, transparent 70%)`,
                            borderRadius: '16px'
                          }}
                        />
                      )}
                      
                      <motion.span 
                        style={{ fontSize: '28px', zIndex: 1 }}
                        animate={selectedEmotion === emotion.value ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {emotion.emoji}
                      </motion.span>
                      
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: selectedEmotion === emotion.value ? emotion.color : 'var(--text-secondary)',
                        zIndex: 1,
                        transition: 'color 0.3s ease'
                      }}>
                        {emotion.label}
                      </span>
                      
                      {/* Selection indicator */}
                      {selectedEmotion === emotion.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            background: emotion.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'white'
                          }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Context Input */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ marginBottom: '32px' }}
              >
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontWeight: '600', 
                  color: 'var(--text-dark)',
                  fontSize: '18px'
                }}>
                  Additional Context (Optional)
                </label>
                <p style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '14px', 
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  Tell me what's on your mind, recent experiences, or specific situations you'd like the quote to address.
                </p>
                
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative' }}
                >
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="For example: 'I've been feeling overwhelmed at work lately and need motivation to keep going...'"
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      maxHeight: '200px',
                      padding: '16px 20px',
                      border: '2px solid #f1f5f9',
                      borderRadius: '16px',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8b7cf6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 124, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#f1f5f9';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {/* Character counter */}
                  {customPrompt.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '12px',
                        fontSize: '12px',
                        color: customPrompt.length > 200 ? '#ef4444' : 'var(--text-muted)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 6px',
                        borderRadius: '8px'
                      }}
                    >
                      {customPrompt.length}/300
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Enhanced Generate Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: !loading && selectedEmotion ? 1.02 : 1,
                    boxShadow: !loading && selectedEmotion ? '0 8px 32px rgba(139, 124, 246, 0.4)' : 'none'
                  }}
                  whileTap={{ scale: !loading && selectedEmotion ? 0.98 : 1 }}
                  onClick={generateQuote}
                  disabled={loading || !selectedEmotion}
                  style={{
                    width: '100%',
                    padding: '18px 32px',
                    background: !loading && selectedEmotion 
                      ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                      : '#e5e7eb',
                    color: !loading && selectedEmotion ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: !loading && selectedEmotion ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: !loading && selectedEmotion 
                      ? '0 4px 20px rgba(139, 124, 246, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Animated background */}
                  {!loading && selectedEmotion && (
                    <motion.div
                      animate={{ 
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  )}
                  
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%'
                        }}
                      />
                      <span style={{ zIndex: 1 }}>Generating your quote...</span>
                    </>
                  ) : (
                    <>
                      <motion.span
                        animate={selectedEmotion ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: '20px', zIndex: 1 }}
                      >
                        ✨
                      </motion.span>
                      <span style={{ zIndex: 1 }}>Generate Inspirational Quote</span>
                    </>
                  )}
                </motion.button>
                
                {!selectedEmotion && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Please select an emotion to generate your quote
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* Enhanced Quote Display */}
            <AnimatePresence>
              {currentQuote && (
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(135deg, ${getEmotionData(selectedEmotion).color}15 0%, ${getEmotionData(selectedEmotion).color}05 100%)`,
                    border: `2px solid ${getEmotionData(selectedEmotion).color}30`,
                    borderRadius: '24px',
                    padding: '48px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 20px 40px ${getEmotionData(selectedEmotion).color}20`,
                    marginBottom: '32px'
                  }}
                >
                  {/* Decorative background elements */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      right: '10%',
                      fontSize: '4rem',
                      opacity: 0.05,
                      color: getEmotionData(selectedEmotion).color
                    }}
                  >
                    {getEmotionData(selectedEmotion).emoji}
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '10%',
                      fontSize: '3rem',
                      opacity: 0.05,
                      color: getEmotionData(selectedEmotion).color
                    }}
                  >
                    ✨
                  </motion.div>

                  {/* Main content */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                      style={{ 
                        fontSize: '64px', 
                        marginBottom: '24px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                      }}
                    >
                      {getEmotionData(selectedEmotion).emoji}
                    </motion.div>
                    
                    <motion.blockquote 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      style={{ 
                        fontSize: 'clamp(20px, 4vw, 28px)', 
                        fontWeight: '600', 
                        lineHeight: '1.4', 
                        color: 'var(--text-dark)', 
                        marginBottom: '24px',
                        fontStyle: 'italic',
                        position: 'relative'
                      }}
                    >
                      <span style={{ 
                        fontSize: '48px', 
                        color: getEmotionData(selectedEmotion).color,
                        position: 'absolute',
                        left: '-20px',
                        top: '-10px',
                        opacity: 0.3
                      }}>
                        "
                      </span>
                      {currentQuote.quote}
                      <span style={{ 
                        fontSize: '48px', 
                        color: getEmotionData(selectedEmotion).color,
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-20px',
                        opacity: 0.3
                      }}>
                        "
                      </span>
                    </motion.blockquote>
                    
                    <motion.cite 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      style={{ 
                        fontSize: '18px', 
                        color: 'var(--text-muted)', 
                        fontWeight: '600',
                        marginBottom: '32px',
                        display: 'block'
                      }}
                    >
                      — {currentQuote.author || 'Anonymous'}
                    </motion.cite>

                    {/* Enhanced Action Buttons */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFavorite(currentQuote.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: favoriteQuotes.has(currentQuote.id) 
                            ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
                            : 'rgba(255, 255, 255, 0.8)',
                          color: favoriteQuotes.has(currentQuote.id) ? 'white' : 'var(--text-dark)',
                          border: favoriteQuotes.has(currentQuote.id) 
                            ? 'none' 
                            : '2px solid rgba(0,0,0,0.1)',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)',
                          boxShadow: favoriteQuotes.has(currentQuote.id) 
                            ? '0 4px 20px rgba(239, 68, 68, 0.3)'
                            : '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                      >
                        <motion.span
                          animate={favoriteQuotes.has(currentQuote.id) ? {
                            scale: [1, 1.3, 1]
                          } : {}}
                          transition={{ duration: 0.3 }}
                          style={{ fontSize: '16px' }}
                        >
                          {favoriteQuotes.has(currentQuote.id) ? '❤️' : '🤍'}
                        </motion.span>
                        {favoriteQuotes.has(currentQuote.id) ? 'Favorited' : 'Add to Favorites'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyQuote(currentQuote)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: 'rgba(139, 124, 246, 0.1)',
                          color: '#8b7cf6',
                          border: '2px solid rgba(139, 124, 246, 0.2)',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(139, 124, 246, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(139, 124, 246, 0.15)';
                          e.target.style.borderColor = 'rgba(139, 124, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(139, 124, 246, 0.1)';
                          e.target.style.borderColor = 'rgba(139, 124, 246, 0.2)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>📋</span>
                        Copy Quote
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Share functionality
                          if (navigator.share) {
                            navigator.share({
                              title: 'Inspirational Quote',
                              text: `"${currentQuote.quote}" - ${currentQuote.author || 'Anonymous'}`
                            });
                          } else {
                            copyQuote(currentQuote);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          color: '#22c55e',
                          border: '2px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(34, 197, 94, 0.15)';
                          e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(34, 197, 94, 0.1)';
                          e.target.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>📤</span>
                        Share
                      </motion.button>
                    </motion.div>
                  </motion.div>
                  
                  {/* Success message for actions */}
                  <AnimatePresence>
                    {/* This could be enhanced with a toast notification system */}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Enhanced Saved Quotes */
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {savedQuotes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card" 
                style={{ 
                  padding: '80px 40px', 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(139, 124, 246, 0.05) 0%, rgba(196, 181, 253, 0.05) 100%)',
                  border: '2px dashed rgba(139, 124, 246, 0.2)'
                }}
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: '72px', marginBottom: '24px' }}
                >
                  💫
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ 
                    marginBottom: '16px', 
                    color: 'var(--text-primary)',
                    fontSize: '28px',
                    fontWeight: '700'
                  }}
                >
                  Your Quote Collection Awaits
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ 
                    color: 'var(--text-secondary)', 
                    marginBottom: '32px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    maxWidth: '400px',
                    margin: '0 auto 32px'
                  }}
                >
                  Start building your personal library of inspiration. Generate quotes that resonate with your emotions and save them for daily motivation.
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 32px rgba(139, 124, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('generate')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    margin: '0 auto',
                    boxShadow: '0 4px 20px rgba(139, 124, 246, 0.3)'
                  }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '20px' }}
                  >
                    ✨
                  </motion.span>
                  Generate Your First Quote
                </motion.button>
                
                {/* Floating decorative elements */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    fontSize: '24px',
                    color: '#8b7cf6'
                  }}
                >
                  💭
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '15%',
                    fontSize: '20px',
                    color: '#c4b5fd'
                  }}
                >
                  🌟
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Enhanced Filter Options */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card" 
                  style={{ 
                    marginBottom: '32px', 
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(139, 124, 246, 0.03) 0%, rgba(196, 181, 253, 0.03) 100%)'
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: 'var(--text-dark)',
                      marginBottom: '8px'
                    }}>
                      Filter Your Collection
                    </h3>
                    <p style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      Browse quotes by emotion or view your favorites
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'center', 
                    flexWrap: 'wrap' 
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion('ALL')}
                      style={{
                        fontSize: '14px',
                        padding: '8px 16px',
                        background: selectedEmotion === 'ALL' 
                          ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                          : 'white',
                        color: selectedEmotion === 'ALL' ? 'white' : 'var(--text-secondary)',
                        border: selectedEmotion === 'ALL' ? 'none' : '2px solid #f1f5f9',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedEmotion === 'ALL' 
                          ? '0 4px 12px rgba(139, 124, 246, 0.3)'
                          : '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      All ({savedQuotes.length})
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion('FAVORITES')}
                      style={{
                        fontSize: '14px',
                        padding: '8px 16px',
                        background: selectedEmotion === 'FAVORITES' 
                          ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
                          : 'white',
                        color: selectedEmotion === 'FAVORITES' ? 'white' : 'var(--text-secondary)',
                        border: selectedEmotion === 'FAVORITES' ? 'none' : '2px solid #f1f5f9',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: selectedEmotion === 'FAVORITES' 
                          ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                          : '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      ❤️ Favorites ({[...favoriteQuotes].length})
                    </motion.button>
                    
                    {emotions.slice(0, -1).map((emotion, index) => {
                      const emotionCount = savedQuotes.filter(q => q.emotion === emotion.value).length;
                      return (
                        <motion.button
                          key={emotion.value}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedEmotion(emotion.value)}
                          style={{
                            fontSize: '14px',
                            padding: '8px 16px',
                            background: selectedEmotion === emotion.value 
                              ? `linear-gradient(135deg, ${emotion.color} 0%, ${emotion.color}cc 100%)`
                              : 'white',
                            color: selectedEmotion === emotion.value ? 'white' : 'var(--text-secondary)',
                            border: selectedEmotion === emotion.value 
                              ? 'none' 
                              : '2px solid #f1f5f9',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: selectedEmotion === emotion.value 
                              ? `0 4px 12px ${emotion.color}30`
                              : '0 2px 8px rgba(0,0,0,0.05)',
                            opacity: emotionCount === 0 ? 0.5 : 1
                          }}
                          disabled={emotionCount === 0}
                        >
                          <span style={{ fontSize: '16px' }}>{emotion.emoji}</span>
                          {emotion.label} ({emotionCount})
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Quotes Grid */}
                <div className="dashboard-grid">
                  <AnimatePresence>
                    {savedQuotes
                      .filter(quote => {
                        if (selectedEmotion === 'ALL') return true;
                        if (selectedEmotion === 'FAVORITES') return favoriteQuotes.has(quote.id);
                        return quote.emotion === selectedEmotion;
                      })
                      .map((quote, index) => {
                        const emotionData = getEmotionData(quote.emotion);
                        return (
                          <motion.div
                            key={quote.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="dashboard-card"
                            style={{
                              background: `linear-gradient(135deg, ${emotionData.color}15 0%, ${emotionData.color}05 100%)`,
                              border: `1px solid ${emotionData.color}30`
                            }}
                          >
                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{emotionData.emoji}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  {formatDate(quote.created_at || quote.generated_at)}
                                </span>
                              </div>
                              <button
                                onClick={() => toggleFavorite(quote.id)}
                                className="btn btn-ghost"
                                style={{ 
                                  padding: '4px',
                                  color: favoriteQuotes.has(quote.id) ? 'var(--accent-red)' : 'var(--text-muted)'
                                }}
                              >
                                {favoriteQuotes.has(quote.id) ? '❤️' : '🤍'}
                              </button>
                            </div>

                            <blockquote style={{ 
                              fontSize: '16px', 
                              fontWeight: '500', 
                              lineHeight: '1.4', 
                              color: 'var(--text-dark)', 
                              marginBottom: '12px',
                              fontStyle: 'italic'
                            }}>
                              "{quote.quote}"
                            </blockquote>
                            
                            <cite style={{ 
                              fontSize: '14px', 
                              color: 'var(--text-muted)', 
                              fontWeight: '500',
                              marginBottom: '16px',
                              display: 'block'
                            }}>
                              — {quote.author || 'Anonymous'}
                            </cite>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => copyQuote(quote)}
                                className="btn btn-ghost"
                                style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                              >
                                📋 Copy
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>

                {savedQuotes.filter(quote => {
                  if (selectedEmotion === 'ALL') return true;
                  if (selectedEmotion === 'FAVORITES') return favoriteQuotes.has(quote.id);
                  return quote.emotion === selectedEmotion;
                }).length === 0 && (
                  <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                    <p style={{ color: 'var(--text-muted)' }}>
                      No quotes found for the selected filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
