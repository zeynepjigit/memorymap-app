import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeEmotion, createDiaryEntry, getDiaryEntry, updateDiaryEntry, editorSuggest, getPersonalizedAdvice, getDiaryEntries, generateInspirationalQuote, getQuoteHistory } from '../services/api';
import { Link } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard';
import QuoteHistory from '../components/QuoteHistory';

const DiaryEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    emotion: ''
  });
  const [emotionResult, setEmotionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Smart Editor states
  const [smartEditorResult, setSmartEditorResult] = useState(null);
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [smartEditorProcessing, setSmartEditorProcessing] = useState(false);
  
  // Deep Analysis states
  const [deepAnalysisResult, setDeepAnalysisResult] = useState(null);
  const [guidingQuestions, setGuidingQuestions] = useState([]);
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);
  const [deepAnalysisProcessing, setDeepAnalysisProcessing] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('write'); // 'write', 'entries'
  const [showSidebar, setShowSidebar] = useState(false);
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  // Quote States
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showQuoteCard, setShowQuoteCard] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [showQuoteHistory, setShowQuoteHistory] = useState(false);
  const [backgroundColors, setBackgroundColors] = useState(null);

  useEffect(() => {
    if (isEditing) {
      (async () => {
        const result = await getDiaryEntry(id);
        if (result.success) {
          const e = result.data.entry;
          setFormData({
            title: e.title || '',
            content: e.content || '',
            location: e.location || '',
            date: e.created_at ? e.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            emotion: e.emotion || ''
          });
        }
      })();
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (activeTab === 'entries') {
      loadEntries();
    }
  }, [activeTab]);

  useEffect(() => {
    // Load saved quotes on component mount
    loadSavedQuotes();
  }, []);

  useEffect(() => {
    // Apply background colors when quote is shown
    if (currentQuote && currentQuote.colors) {
      setBackgroundColors(currentQuote.colors);
    } else {
      setBackgroundColors(null);
    }
  }, [currentQuote]);

  const loadEntries = async () => {
    setEntriesLoading(true);
    try {
      const result = await getDiaryEntries(20);
      if (result.success) {
        setEntries(result.data.entries || []);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
    setEntriesLoading(false);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-analyze emotion when content changes
    if (name === 'content' && value.length > 10) {
      setAnalyzing(true);
      const er = await analyzeEmotion(value);
      if (er.success) setEmotionResult(er.data);
      setAnalyzing(false);
    }
  };

  const handleSmartEditor = async () => {
    if (!formData.content.trim()) return;
    setSmartEditorProcessing(true);
    try {
      console.log('Calling Smart Editor with:', formData.content);
      const result = await editorSuggest({
        text: formData.content,
        intent: 'rewrite',
        target_tone: 'natural'
      });
      console.log('Smart Editor result:', result);
      if (result.success) {
        setSmartEditorResult(result.suggestion);
        setShowSmartEditor(true);
      } else {
        console.error('Smart Editor failed:', result.error);
        alert('Smart Editor failed: ' + result.error);
      }
    } catch (error) {
      console.error('Smart Editor error:', error);
      alert('Smart Editor error: ' + error.message);
    }
    setSmartEditorProcessing(false);
  };

  const handleDeepAnalysis = async () => {
    if (!formData.content.trim()) return;
    setDeepAnalysisProcessing(true);
    try {
      console.log('Starting Deep Analysis with:', formData.content);
      
      // Get emotion analysis
      const emotionResult = await analyzeEmotion(formData.content);
      console.log('Emotion analysis result:', emotionResult);
      
      // Enhanced prompt for better context-aware questions
      const questionPrompt = `As a thoughtful life coach and therapist, analyze this diary entry: "${formData.content.substring(0, 300)}..." 
      
      Detected emotion: ${emotionResult.success ? emotionResult.data.emotion : 'neutral'}
      
      Generate 4-5 deeply insightful, context-aware questions that will help this person:
      1. Explore their emotions more deeply
      2. Understand the root causes of their feelings
      3. Gain new perspectives on their situation
      4. Identify patterns in their thoughts and behaviors
      5. Find actionable insights for personal growth
      
      Make questions:
      - Personal and empathetic (use "you" and "your")
      - Specific to their content and emotional state
      - Open-ended to encourage deep reflection
      - Actionable where appropriate
      - Focused on self-discovery and growth
      
      Return only the questions, one per line, without numbering.`;
      
      console.log('Calling getPersonalizedAdvice with prompt:', questionPrompt);
      const questionsResult = await getPersonalizedAdvice(questionPrompt);
      console.log('Questions result:', questionsResult);
      
      if (questionsResult.success) {
        const questions = questionsResult.answer.split('\n').filter(q => q.trim().length > 0);
        console.log('Parsed questions:', questions);
        setGuidingQuestions(questions);
        setDeepAnalysisResult(emotionResult.success ? emotionResult.data : null);
        setShowDeepAnalysis(true);
        setShowSidebar(true); // Auto-show sidebar for questions
      } else {
        console.error('Deep Analysis failed:', questionsResult.error);
        alert('Deep Analysis failed: ' + questionsResult.error);
      }
    } catch (error) {
      console.error('Deep Analysis error:', error);
      alert('Deep Analysis error: ' + error.message);
    }
    setDeepAnalysisProcessing(false);
  };

  const applySmartEditorResult = () => {
    if (smartEditorResult) {
      setFormData(prev => ({ ...prev, content: smartEditorResult }));
      setShowSmartEditor(false);
      setSmartEditorResult(null);
    }
  };

  const addQuestionToContent = (question) => {
    setFormData(prev => ({ 
      ...prev, 
      content: prev.content + '\n\n💭 ' + question 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content fields.');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = { 
        title: formData.title.trim(), 
        content: formData.content.trim(), 
        location: formData.location.trim() || null, 
        mood: emotionResult?.emotion || formData.emotion || null
      };
      
      const result = isEditing ? await updateDiaryEntry(id, payload) : await createDiaryEntry(payload);
      
      if (result.success) {
        // Show success message
        const action = isEditing ? 'updated' : 'created';
        console.log(`Memory ${action} successfully:`, result.data);
        
        // Navigate back to dashboard
        navigate('/dashboard');
      } else {
        // Show error message
        console.error(`Failed to ${isEditing ? 'update' : 'create'} memory:`, result.error);
        alert(`Failed to ${isEditing ? 'update' : 'create'} memory: ${result.error}`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const result = await updateDiaryEntry(entryId, { deleted: true });
        if (result.success) {
          loadEntries();
        }
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setFormData({
      title: entry.title || '',
      content: entry.content || '',
      location: entry.location || '',
      date: entry.created_at ? entry.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      emotion: entry.emotion || ''
    });
    setActiveTab('write');
  };

  // Quote-related functions
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

  const generateQuote = async () => {
    if (!emotionResult?.emotion && !formData.emotion) {
      alert('Please write some content first so we can analyze your emotions and generate a personalized quote.');
      return;
    }

    setQuoteLoading(true);
    try {
      const emotion = emotionResult?.emotion || formData.emotion || 'NEUTRAL';
      const result = await generateInspirationalQuote({
        emotion: emotion,
        diary_content: formData.content
      });

      if (result.success) {
        setCurrentQuote(result.data);
        setShowQuoteCard(true);
      } else {
        alert('Failed to generate quote: ' + result.error);
      }
    } catch (error) {
      console.error('Quote generation error:', error);
      alert('Failed to generate quote: ' + error.message);
    }
    setQuoteLoading(false);
  };

  const handleSaveQuote = (quoteData) => {
    setSavedQuotes(prev => [quoteData, ...prev]);
    // In a real app, you'd save this to the backend
    console.log('Quote saved:', quoteData);
  };

  const handleCloseQuote = () => {
    setShowQuoteCard(false);
    setCurrentQuote(null);
    setBackgroundColors(null);
  };

  const handleShowQuoteHistory = () => {
    setShowQuoteHistory(true);
  };

  const quickPrompts = [
    "How am I feeling today?",
    "What happened that made me happy?",
    "What challenges did I face?",
    "What am I grateful for?",
    "What did I learn today?"
  ];

  return (
    <div className="diary-container">
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

      {/* Main Content Area */}
      <div className="diary-main-area">
        {/* Main Writing Area */}
        <div className="diary-writing-area">
          {/* Tabs */}
          <div className="diary-tabs">
            <button
              onClick={() => setActiveTab('write')}
              className={`diary-tab-button ${activeTab === 'write' ? 'active' : ''}`}
            >
              ✍️ Write New Entry
            </button>
            <button
              onClick={() => setActiveTab('entries')}
              className={`diary-tab-button ${activeTab === 'entries' ? 'active' : ''}`}
            >
              📚 View Entries
            </button>
          </div>

          {/* Tab Content */}
          <div className="diary-tab-content">
            {activeTab === 'write' ? (
              // Writing Tab
              <div className="diary-form-container">
                {/* Debug Test Section */}
                <div style={{ 
                  background: '#f0f9ff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '24px' 
                }}>
                  <h3 style={{ color: '#0369a1', marginBottom: '12px' }}>🧪 Debug Test Section</h3>
                  <p style={{ color: '#0369a1', marginBottom: '12px' }}>
                    Test the AI features here. Write some text below and try the buttons.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, content: 'Today I felt really happy because I accomplished something important. I worked hard on my project and finally finished it. The feeling of completion was amazing!' }))}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px' }}
                    >
                      Load Test Text
                    </button>
                    <button
                      onClick={handleSmartEditor}
                      disabled={smartEditorProcessing}
                      className="btn btn-primary"
                      style={{ fontSize: '12px' }}
                    >
                      {smartEditorProcessing ? 'Testing...' : 'Test Smart Editor'}
                    </button>
                    <button
                      onClick={handleDeepAnalysis}
                      disabled={deepAnalysisProcessing}
                      className="btn btn-primary"
                      style={{ fontSize: '12px' }}
                    >
                      {deepAnalysisProcessing ? 'Testing...' : 'Test Deep Analysis'}
                    </button>
                  </div>
                  {emotionResult && (
                    <div style={{ marginTop: '12px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                      <strong>Emotion Result:</strong> {JSON.stringify(emotionResult)}
                    </div>
                  )}
                </div>

                <div className="section-header" style={{ marginBottom: '32px' }}>
                  <h1 className="section-title">
                    {selectedEntry ? 'Edit Memory' : 'New Memory Entry'}
                  </h1>
                  <p className="section-subtitle">
                    {selectedEntry 
                      ? 'Update your memories and reflections' 
                      : 'Capture your thoughts, feelings, and experiences in your memory map'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gap: '24px' }}>
                      {/* Title and Date */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Memory Title</label>
                          <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Give your memory a meaningful title..."
                            value={formData.title}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="form-group">
                        <label className="form-label">Location (Optional)</label>
                        <input
                          type="text"
                          name="location"
                          className="form-input"
                          placeholder="Where are you writing from? (e.g., Home, Paris, Coffee Shop)"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Content */}
                      <div className="form-group">
                        <label className="form-label">Your Thoughts</label>
                        <textarea
                          name="content"
                          className="form-input form-textarea"
                          style={{ minHeight: '300px', borderRadius: '16px' }}
                          placeholder="Start writing your thoughts, feelings, and experiences..."
                          value={formData.content}
                          onChange={handleChange}
                          required
                        />
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                          💡 Tip: Write freely about your day, emotions, thoughts, or anything that comes to mind. The AI will analyze your emotional patterns and map your memories.
                        </div>
                      </div>

                      {/* AI Tools - Floating Action Buttons */}
                      {formData.content.length > 10 && (
                        <div className="diary-floating-ai-tools">
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                              AI Tools:
                            </span>
                            <button
                              type="button"
                              onClick={handleSmartEditor}
                              disabled={smartEditorProcessing}
                              className="btn btn-secondary"
                              style={{ fontSize: '14px', padding: '8px 16px' }}
                            >
                              {smartEditorProcessing ? (
                                <>
                                  <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                                  Improving...
                                </>
                              ) : (
                                <>
                                  ✨ Improve Text
                                </>
                              )}
                            </button>
                            
                            <button
                              type="button"
                              onClick={handleDeepAnalysis}
                              disabled={deepAnalysisProcessing}
                              className="btn btn-primary"
                              style={{ fontSize: '14px', padding: '8px 16px' }}
                            >
                              {deepAnalysisProcessing ? (
                                <>
                                  <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  🔍 Get Insights
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={generateQuote}
                              disabled={quoteLoading}
                              className="btn btn-secondary"
                              style={{ 
                                fontSize: '14px', 
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                color: 'white',
                                border: 'none'
                              }}
                            >
                              {quoteLoading ? (
                                <>
                                  <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  💭 Get Quote
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleShowQuoteHistory}
                              className="btn btn-ghost"
                              style={{ fontSize: '14px', padding: '8px 16px' }}
                            >
                              📚 Quote History
                            </button>
                          </div>

                          {/* Quick Emotion Display */}
                          {emotionResult && (
                            <div className="diary-emotion-display">
                              <span className="diary-emotion-label">
                                Detected emotion:
                              </span>
                              <div className={`diary-emotion-badge ${
                                emotionResult.emotion === 'POSITIVE' ? 'positive' : 
                                emotionResult.emotion === 'NEGATIVE' ? 'negative' : 'neutral'
                              }`}>
                                {emotionResult.emotion}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Prompts */}
                  {!selectedEntry && formData.content.length < 10 && (
                    <div className="card" style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
                        💭 Need inspiration? Try these memory prompts:
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {quickPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, content: prompt + ' ' }))}
                            className="btn btn-ghost"
                            style={{ textAlign: 'left', fontSize: '14px', justifyContent: 'flex-start' }}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Link to="/dashboard" className="btn btn-secondary">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <div className="loading">
                          <div className="spinner"></div>
                          <span>{selectedEntry ? 'Updating...' : 'Saving...'}</span>
                        </div>
                      ) : (
                        <>
                          {selectedEntry ? 'Update Memory' : 'Save Memory'}
                          <span>✨</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
                            ) : (
                  // Entries Tab
                  <div>
                    <div className="section-header" style={{ marginBottom: '32px' }}>
                      <h1 className="section-title">Your Memory Entries</h1>
                      <p className="section-subtitle">
                        Browse, edit, and manage your previous diary entries
                      </p>
                    </div>

                    {entriesLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner"></div>
                        <p>Loading your entries...</p>
                      </div>
                    ) : entries.length > 0 ? (
                      <div className="diary-entries-list">
                        {entries.map((entry) => (
                          <div key={entry.id} className="diary-entry-card">
                            <div className="diary-entry-header">
                              <div>
                                <h3 className="diary-entry-title">
                                  {entry.title}
                                </h3>
                                <div className="diary-entry-meta">
                                  <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                                  {entry.location && <span>📍 {entry.location}</span>}
                                  {entry.emotion && (
                                    <span className={`diary-entry-emotion ${
                                      entry.emotion === 'POSITIVE' ? 'positive' : 
                                      entry.emotion === 'NEGATIVE' ? 'negative' : 'neutral'
                                    }`}>
                                      {entry.emotion}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="diary-entry-actions">
                                <button
                                  onClick={() => handleEditEntry(entry)}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '12px', padding: '6px 12px' }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="btn btn-ghost"
                                  style={{ fontSize: '12px', padding: '6px 12px', color: '#DC2626' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="diary-entry-content">
                              {entry.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="diary-empty-state">
                        <div className="diary-empty-icon">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                          </svg>
                        </div>
                        <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>No entries yet</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                          Start writing your first memory entry to see it here.
                        </p>
                        <button
                          onClick={() => setActiveTab('write')}
                          className="btn btn-primary"
                        >
                          Write Your First Entry
                        </button>
                      </div>
                    )}
                  </div>
                )}
          </div>
        </div>

        {/* AI Sidebar */}
        {(showDeepAnalysis || showSmartEditor) && (
          <div className="diary-ai-sidebar">
            {/* Sidebar Header */}
            <div className="diary-sidebar-header">
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {showDeepAnalysis ? '🔍 AI Insights' : '✨ Smart Editor'}
              </h3>
              <button
                onClick={() => {
                  setShowDeepAnalysis(false);
                  setShowSmartEditor(false);
                  setGuidingQuestions([]);
                  setDeepAnalysisResult(null);
                  setSmartEditorResult(null);
                }}
                className="diary-sidebar-close"
              >
                ×
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="diary-sidebar-content">
              {/* Smart Editor Result */}
              {showSmartEditor && smartEditorResult && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Improved Version
                  </h4>
                  <div style={{ 
                    background: '#F8FAFC',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '16px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6', 
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      margin: 0
                    }}>
                      {smartEditorResult}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={applySmartEditorResult}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Apply Changes
                    </button>
                    <button
                      onClick={() => {
                        setShowSmartEditor(false);
                        setSmartEditorResult(null);
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Keep Original
                    </button>
                  </div>
                </div>
              )}

              {/* Deep Analysis Result */}
              {showDeepAnalysis && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Emotional Analysis & Reflection Questions
                  </h4>
                  
                  {deepAnalysisResult && (
                    <div style={{ 
                      background: '#F0F9FF', 
                      padding: '16px', 
                      borderRadius: '8px',
                      border: '1px solid #BAE6FD',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0369A1' }}>
                          Emotional Insight:
                        </span>
                        <div className={`diary-emotion-badge ${
                          deepAnalysisResult.emotion === 'POSITIVE' ? 'positive' : 
                          deepAnalysisResult.emotion === 'NEGATIVE' ? 'negative' : 'neutral'
                        }`}>
                          {deepAnalysisResult.emotion}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: '#0369A1', lineHeight: '1.5', margin: 0 }}>
                        Based on your writing, we detected a {deepAnalysisResult.emotion.toLowerCase()} emotional tone. 
                        Here are some questions to help you reflect deeper:
                      </p>
                    </div>
                  )}

                  {guidingQuestions.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        💭 Reflection Questions:
                      </h5>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {guidingQuestions.map((question, index) => (
                          <div
                            key={index}
                            className="diary-question-card"
                            onClick={() => addQuestionToContent(question)}
                          >
                            <p className="diary-question-text">
                              {question}
                            </p>
                            <div className="diary-question-hint">
                              <span>Click to add to your entry</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14"/>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quote Card Modal */}
        {showQuoteCard && currentQuote && (
          <div className="quote-modal-overlay" onClick={handleCloseQuote}>
            <div className="quote-modal-content" onClick={(e) => e.stopPropagation()}>
              <QuoteCard
                quote={currentQuote.quote}
                author={currentQuote.author}
                emotion={currentQuote.emotion}
                colors={currentQuote.colors}
                timestamp={currentQuote.timestamp}
                onClose={handleCloseQuote}
                onSave={handleSaveQuote}
                isVisible={true}
              />
            </div>
          </div>
        )}

        {/* Quote History Modal */}
        <QuoteHistory
          quotes={savedQuotes}
          onClose={() => setShowQuoteHistory(false)}
          isVisible={showQuoteHistory}
        />

        {/* Background Color Overlay */}
        {backgroundColors && (
          <div 
            className="background-color-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${backgroundColors.background}40 0%, ${backgroundColors.accent}20 100%)`,
              pointerEvents: 'none',
              zIndex: 100,
              transition: 'all 0.5s ease'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DiaryEntry;