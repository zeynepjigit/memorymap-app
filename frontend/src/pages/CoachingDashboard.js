import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  addDiaryEntryToVectorDB, 
  getPersonalizedAdvice, 
  getEmotionalInsights,
  getDemoData 
} from '../services/api';

const CoachingDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [demoData, setDemoData] = useState([]);
  const [explainableData, setExplainableData] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const insightsResponse = await getEmotionalInsights();
      if (insightsResponse.success) {
        setInsights(insightsResponse.insights);
      }
      const demoResponse = await getDemoData();
      if (demoResponse.success) {
        setDemoData(demoResponse.demo_data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      message: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getPersonalizedAdvice(userMessage.message);
      if (response.success) {
        const aiMessage = {
          message: response.answer || response.advice,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
          explainableData: response.explainable_ai || null,
          sources: response.sources || []
        };
        setChatMessages(prev => [...prev, aiMessage]);
        if (response.explainable_ai) setExplainableData(response.explainable_ai);
      } else {
        setChatMessages(prev => [...prev, { 
          message: 'I apologize, but I cannot provide a response right now. Please try again.', 
          isUser: false, 
          timestamp: new Date().toLocaleTimeString() 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        message: 'An error occurred. Please try again.', 
        isUser: false, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addDemoEntry = async (entry) => {
    try {
      const response = await addDiaryEntryToVectorDB({
        content: entry.content,
        emotion: entry.emotion,
        date: entry.date,
        location: entry.location,
        tags: entry.tags
      });
      if (response.success) {
        alert(`${entry.id} successfully added to vector database!`);
      } else {
        alert('Error adding entry.');
      }
    } catch (error) {
      console.error('Error adding demo entry:', error);
      alert('Error adding entry.');
    }
  };

  const handleShowExplanation = (data) => {
    setExplainableData(data);
    setShowExplanation(true);
  };

  const getPersonalizedPrompts = () => {
    const basePrompts = [
      {
        text: "How can I improve my emotional well-being?",
        icon: "💚",
        gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
      },
      {
        text: "What patterns do you see in my recent entries?",
        icon: "📊",
        gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      },
      {
        text: "Give me advice for managing stress",
        icon: "🧘‍♀️",
        gradient: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)"
      },
      {
        text: "Help me understand my mood changes",
        icon: "🌙",
        gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
      },
      {
        text: "What are my most positive moments?",
        icon: "✨",
        gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)"
      }
    ];

    // Add personalized prompts based on user insights
    if (insights && insights.most_common_emotions && insights.most_common_emotions.length > 0) {
      const topEmotion = insights.most_common_emotions[0][0];
      const personalizedPrompts = [
        {
          text: `Why do I experience ${topEmotion} feelings so often?`,
          icon: "🤔",
          gradient: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)"
        },
        {
          text: `How can I build on my ${topEmotion} experiences?`,
          icon: "🌱",
          gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
        }
      ];
      
      // Replace last two prompts with personalized ones
      return [...basePrompts.slice(0, 3), ...personalizedPrompts];
    }

    return basePrompts;
  };

  const suggestedPrompts = getPersonalizedPrompts();

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link" style={{ color: 'var(--primary-purple)' }}>AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-header" 
          style={{ marginBottom: '32px' }}
        >
          <h1 className="section-title">AI Memory Coach</h1>
          <p className="section-subtitle">
            Your intelligent companion for memory analysis and personal growth. Ask questions, explore patterns, and get personalized insights from your memory map.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="tabs-container"
        >
          <div className="tabs-header" style={{ position: 'relative' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M8 9h8"/>
                <path d="M8 13h6"/>
              </svg>
              Chat with AI
              {chatMessages.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#8b7cf6',
                    marginLeft: '4px'
                  }}
                />
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              Insights
              {insights && insights.total_entries > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    marginLeft: '4px'
                  }}
                />
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
              onClick={() => setActiveTab('demo')}
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Demo Data
            </motion.button>
          </div>

          <div className="tab-content">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                {chatMessages.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ textAlign: 'center', padding: '48px 24px' }}
                    >
                      {/* AI Coach Avatar with Animation */}
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}
                      >
                        <motion.div 
                          animate={{ 
                            boxShadow: [
                              '0 0 20px rgba(139, 124, 246, 0.3)',
                              '0 0 40px rgba(139, 124, 246, 0.5)',
                              '0 0 20px rgba(139, 124, 246, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 50%, #ede9fe 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Animated Background Particles */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            style={{
                              position: 'absolute',
                              width: '120%',
                              height: '120%',
                              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            }}
                          />
                          
                          {/* AI Brain Icon */}
                          <motion.div
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                              <path d="M12 7v10"/>
                              <circle cx="12" cy="12" r="2"/>
                      </svg>
                          </motion.div>
                        </motion.div>
                        
                        {/* Floating Sparkles */}
                        <motion.div
                          animate={{ 
                            y: [-10, 10, -10],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '20px' }}
                        >
                          ✨
                        </motion.div>
                        <motion.div
                          animate={{ 
                            y: [10, -10, 10],
                            rotate: [360, 180, 0]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          style={{ position: 'absolute', bottom: '-5px', left: '-5px', fontSize: '16px' }}
                        >
                          🧠
                        </motion.div>
                      </motion.div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ 
                          marginBottom: '12px', 
                          color: 'var(--text-primary)',
                          fontSize: '24px',
                          fontWeight: '700'
                        }}
                      >
                        {insights && insights.total_entries > 0 
                          ? `Welcome back! I'm your AI Memory Coach` 
                          : `Hi! I'm your AI Memory Coach`}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        style={{ 
                          color: 'var(--text-secondary)', 
                          marginBottom: '40px', 
                          maxWidth: '480px', 
                          margin: '0 auto 40px', 
                          lineHeight: '1.6',
                          fontSize: '16px'
                        }}
                      >
                        {insights && insights.total_entries > 0 
                          ? `I've analyzed ${insights.total_entries} of your memories and I'm ready to help you discover patterns, understand emotions, and guide your personal growth journey.`
                          : `I can help you understand your thoughts, emotions, and memory patterns. Ask me anything about your memories or personal growth journey.`}
                      </motion.p>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        style={{ display: 'grid', gap: '16px', maxWidth: '600px', margin: '0 auto' }}
                      >
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          marginBottom: '8px', 
                          color: 'var(--text-dark)' 
                        }}>
                        Try asking me:
                      </h4>
                        
                      {suggestedPrompts.map((prompt, index) => (
                          <motion.button
                          key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setInputMessage(prompt.text)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '16px 20px',
                              background: 'white',
                              border: '2px solid #f1f5f9',
                              borderRadius: '16px',
                              fontSize: '15px',
                              fontWeight: '500',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              textAlign: 'left',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = '#8b7cf6';
                              e.target.style.background = '#fafafa';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#f1f5f9';
                              e.target.style.background = 'white';
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              background: prompt.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              flexShrink: 0
                            }}>
                              {prompt.icon}
                    </div>
                            <span>{prompt.text}</span>
                            <div style={{ marginLeft: 'auto', opacity: 0.4 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                  </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>

                <div className="chat-messages" style={{ padding: '0 16px', maxHeight: '60vh', overflowY: 'auto' }}>
                  <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{
                          display: 'flex',
                          justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                          marginBottom: '16px',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        {/* AI Avatar for AI messages */}
                        {!msg.isUser && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '4px'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                            </svg>
                          </motion.div>
                        )}
                        
                        <div style={{ 
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: msg.isUser ? 'flex-end' : 'flex-start'
                        }}>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            style={{
                              padding: '12px 16px',
                              borderRadius: msg.isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                              background: msg.isUser 
                                ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                                : 'white',
                              color: msg.isUser ? 'white' : 'var(--text-primary)',
                              fontSize: '15px',
                              lineHeight: '1.5',
                              boxShadow: msg.isUser 
                                ? '0 4px 12px rgba(139, 124, 246, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                              border: msg.isUser ? 'none' : '1px solid #f1f5f9',
                              position: 'relative'
                            }}
                          >
                            <div style={{ marginBottom: msg.timestamp ? '8px' : '0' }}>
                              {msg.message}
                            </div>
                            
                            {msg.timestamp && (
                              <div style={{ 
                                fontSize: '11px', 
                                opacity: 0.7,
                                textAlign: msg.isUser ? 'right' : 'left'
                              }}>
                          {msg.timestamp}
                        </div>
                            )}
                          </motion.div>
                          
                          {/* Explainable AI Button */}
                        {!msg.isUser && msg.explainableData && (
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            onClick={() => handleShowExplanation(msg.explainableData)}
                              style={{
                                marginTop: '8px',
                                padding: '6px 12px',
                                background: 'rgba(139, 124, 246, 0.1)',
                                border: '1px solid rgba(139, 124, 246, 0.2)',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#8b7cf6',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(139, 124, 246, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(139, 124, 246, 0.1)';
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                              <path d="M12 17h.01"/>
                            </svg>
                            Why this advice?
                            </motion.button>
                        )}
                      </div>
                        
                        {/* User Avatar Placeholder */}
                        {msg.isUser && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '4px',
                              fontSize: '16px'
                            }}
                          >
                            👤
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Loading Animation */}
                  <AnimatePresence>
                  {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          marginBottom: '16px',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        {/* AI Avatar */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '4px'
                        }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                            </svg>
                          </motion.div>
                        </div>
                        
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '20px 20px 20px 4px',
                          background: 'white',
                          color: 'var(--text-primary)',
                          fontSize: '15px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#8b7cf6'
                            }}
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#8b7cf6'
                            }}
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#8b7cf6'
                            }}
                          />
                          <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>
                            Thinking...
                          </span>
                      </div>
                      </motion.div>
                  )}
                  </AnimatePresence>
                </div>
                {/* Sources */}
                {chatMessages.filter(m => !m.isUser && m.sources?.length).length > 0 && (
                  <div className="card" style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Sources</h4>
                    {chatMessages.filter(m => !m.isUser && m.sources?.length).slice(-1)[0].sources.map((s, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 600 }}>{s.metadata?.date} • {s.metadata?.emotion}</div>
                        <div>{(s.content || '').slice(0, 180)}...</div>
                      </div>
                    ))}
                  </div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'sticky',
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0.95) 70%, transparent 100%)',
                    padding: '20px 16px 24px',
                    margin: '0 -16px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '12px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      flex: 1,
                      position: 'relative'
                    }}>
                      <motion.textarea
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Ask me anything about your memories and emotions..."
                        style={{
                          width: '100%',
                          minHeight: '52px',
                          maxHeight: '120px',
                          padding: '14px 20px',
                          border: '2px solid #f1f5f9',
                          borderRadius: '26px',
                          fontSize: '15px',
                          lineHeight: '1.5',
                          background: 'white',
                          color: 'var(--text-primary)',
                          resize: 'none',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontFamily: 'inherit',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8b7cf6';
                          e.target.style.boxShadow = '0 4px 20px rgba(139, 124, 246, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#f1f5f9';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                        }}
                        rows={1}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />
                      
                      {/* Character count or other indicators could go here */}
                      {inputMessage.length > 100 && (
                        <div style={{
                          position: 'absolute',
                          right: '20px',
                          bottom: '8px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          {inputMessage.length}
                        </div>
                      )}
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: inputMessage.trim() && !isLoading
                          ? 'linear-gradient(135deg, #8b7cf6 0%, #c4b5fd 100%)'
                          : '#e5e7eb',
                        border: 'none',
                        cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: inputMessage.trim() && !isLoading
                          ? '0 4px 15px rgba(139, 124, 246, 0.4)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        flexShrink: 0
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                        </motion.div>
                      ) : (
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={inputMessage.trim() ? "white" : "#9ca3af"} 
                          strokeWidth="2"
                        >
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                      )}
                    </motion.button>
                </div>
                  
                  {/* Quick actions */}
                  {inputMessage.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        marginTop: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {['✨ Analyze mood', '📊 Show patterns', '💡 Get advice'].map((action, index) => (
                        <motion.button
                          key={action}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setInputMessage(action.split(' ').slice(1).join(' '))}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(139, 124, 246, 0.1)',
                            border: '1px solid rgba(139, 124, 246, 0.2)',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#8b7cf6',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(139, 124, 246, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(139, 124, 246, 0.1)';
                          }}
                        >
                          {action}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {insights ? (
                  <div className="dashboard-grid">
                    <div className="dashboard-card">
                      <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Emotional Analysis</h3>
                        <div className="dashboard-card-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </div>
                      </div>
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Entries</span>
                          <strong style={{ color: 'var(--text-dark)' }}>{insights.total_entries}</strong>
                        </div>
                        {insights.most_common_emotions && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Most Common Emotion</span>
                            <strong style={{ color: 'var(--primary-purple)' }}>
                              {insights.most_common_emotions[0]?.[0]}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="dashboard-card">
                      <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Emotion Distribution</h3>
                        <div className="dashboard-card-icon" style={{ background: 'var(--gradient-blue)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3v18h18"/>
                            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                          </svg>
                        </div>
                      </div>
                      {insights.emotion_distribution && (
                        <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
                          {Object.entries(insights.emotion_distribution).map(([emotion, count]) => (
                            <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ minWidth: '80px', fontSize: '13px', textTransform: 'capitalize', color: 'var(--text-dark)' }}>
                                {emotion}
                              </div>
                              <div style={{ flex: 1, background: 'var(--border-light)', height: '6px', borderRadius: '3px' }}>
                                <div style={{ 
                                  width: `${(count / insights.total_entries) * 100}%`, 
                                  height: '6px', 
                                  borderRadius: '3px', 
                                  background: 'var(--gradient-purple)' 
                                }} />
                              </div>
                              <div style={{ minWidth: '30px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>
                                {count}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div className="loading">
                      <div className="spinner"></div>
                      <span>Loading insights...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Demo Tab */}
            {activeTab === 'demo' && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Demo Memory Data</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                    Add these sample memory entries to your vector database to test the AI coaching functionality with realistic data.
                  </p>
                </div>

                <div className="dashboard-grid">
                  {demoData.map((entry) => (
                    <div key={entry.id} className="dashboard-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-dark)' }}>{entry.id}</h4>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{entry.date}</div>
                        </div>
                        <span style={{ 
                          background: 'var(--gradient-purple)', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: 'var(--radius-lg)', 
                          fontSize: '12px', 
                          fontWeight: '500' 
                        }}>
                          {entry.emotion}
                        </span>
                      </div>
                      
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' }}>
                        {entry.content}
                      </p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        {entry.tags.map((tag, index) => (
                          <span key={index} style={{ 
                            background: 'var(--background-gray)', 
                            color: 'var(--text-muted)', 
                            padding: '2px 8px', 
                            borderRadius: 'var(--radius-lg)', 
                            fontSize: '12px',
                            border: '1px solid var(--border-light)'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => addDemoEntry(entry)}
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '14px' }}
                      >
                        Add to Vector DB
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Explainable AI Modal */}
        {showExplanation && explainableData && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px'
            }}
            onClick={() => setShowExplanation(false)}
          >
            <div 
              className="card"
              style={{ 
                maxWidth: '500px', 
                width: '100%', 
                maxHeight: '80vh', 
                overflowY: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--gradient-purple)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--text-dark)' }}>AI Explanation</h3>
                </div>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="btn btn-ghost"
                  style={{ padding: '4px 8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    Confidence Score
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'var(--border-light)', height: '8px', borderRadius: '4px' }}>
                      <div style={{ 
                        width: `${explainableData.confidence_score * 100}%`, 
                        height: '8px', 
                        background: 'var(--gradient-purple)', 
                        borderRadius: '4px' 
                      }} />
                    </div>
                    <strong style={{ color: 'var(--text-dark)' }}>{Math.round(explainableData.confidence_score * 100)}%</strong>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    Explanation
                  </h4>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-dark)' }}>{explainableData.explanation}</p>
                </div>

                {explainableData.patterns?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>
                      Detected Patterns
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {explainableData.patterns.map((pattern, index) => (
                        <div key={index} className="card" style={{ padding: '12px', fontSize: '14px', lineHeight: '1.5' }}>
                          {pattern.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {explainableData.evidence?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>
                      Evidence
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {explainableData.evidence.map((evidence, index) => (
                        <div key={index} className="card" style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '600', fontSize: '12px', marginBottom: '4px', color: 'var(--text-muted)' }}>
                            {evidence.date}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                            {evidence.content_preview}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachingDashboard;