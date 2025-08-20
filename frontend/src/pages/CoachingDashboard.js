import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          message: response.advice,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
          explainableData: response.explainable_ai || null
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

  const suggestedPrompts = [
    "How can I improve my emotional well-being?",
    "What patterns do you see in my recent entries?",
    "Give me advice for managing stress",
    "Help me understand my mood changes",
    "What are my most positive moments?"
  ];

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
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">AI Memory Coach</h1>
          <p className="section-subtitle">
            Your intelligent companion for memory analysis and personal growth. Ask questions, explore patterns, and get personalized insights from your memory map.
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat with AI
            </button>
            <button 
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
            <button 
              className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
              onClick={() => setActiveTab('demo')}
            >
              Demo Data
            </button>
          </div>

          <div className="tab-content">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
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
                    <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>
                      Hi! I'm your AI Memory Coach
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
                      I can help you understand your thoughts, emotions, and memory patterns. Ask me anything about your memories or personal growth journey.
                    </p>
                    
                    <div style={{ display: 'grid', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-dark)' }}>
                        Try asking me:
                      </h4>
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(prompt)}
                          className="btn btn-secondary"
                          style={{ textAlign: 'left', fontSize: '14px', justifyContent: 'flex-start' }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.isUser ? 'user' : 'ai'}`}>
                      <div className={`chat-bubble ${msg.isUser ? 'user' : 'ai'}`}>
                        <div style={{ marginBottom: '4px' }}>{msg.message}</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          {msg.timestamp}
                        </div>
                        {!msg.isUser && msg.explainableData && (
                          <button
                            onClick={() => handleShowExplanation(msg.explainableData)}
                            className="btn btn-ghost"
                            style={{ marginTop: '8px', fontSize: '12px', padding: '4px 8px' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                              <path d="M12 17h.01"/>
                            </svg>
                            Why this advice?
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="chat-message ai">
                      <div className="chat-bubble ai">
                        <div className="loading">
                          <div className="spinner"></div>
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="chat-input-container">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask me anything about your memories and emotions..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    className="chat-send-btn" 
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div>
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
              </div>
            )}

            {/* Demo Tab */}
            {activeTab === 'demo' && (
              <div>
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
              </div>
            )}
          </div>
        </div>

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