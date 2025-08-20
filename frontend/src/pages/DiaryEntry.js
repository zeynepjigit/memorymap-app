import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeEmotion, createDiaryEntry, getDiaryEntry, updateDiaryEntry } from '../services/api';
import { Link } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { 
      title: formData.title, 
      content: formData.content, 
      location: formData.location, 
      emotion: emotionResult?.emotion || formData.emotion 
    };
    
    const result = isEditing ? await updateDiaryEntry(id, payload) : await createDiaryEntry(payload);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const quickPrompts = [
    "How am I feeling today?",
    "What happened that made me happy?",
    "What challenges did I face?",
    "What am I grateful for?",
    "What did I learn today?"
  ];

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
          <h1 className="section-title">
            {isEditing ? 'Edit Memory' : 'New Memory Entry'}
          </h1>
          <p className="section-subtitle">
            {isEditing 
              ? 'Update your memories and reflections' 
              : 'Capture your thoughts, feelings, and experiences in your memory map'
            }
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                    style={{ minHeight: '200px', borderRadius: '16px' }}
                    placeholder="Start writing your thoughts, feelings, and experiences..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    💡 Tip: Write freely about your day, emotions, thoughts, or anything that comes to mind. The AI will analyze your emotional patterns and map your memories.
                  </div>
                </div>

                {/* AI Emotion Analysis */}
                {(analyzing || emotionResult) && (
                  <div style={{ 
                    background: 'var(--gray-50)', 
                    border: '1px solid var(--gray-200)', 
                    borderRadius: '12px', 
                    padding: '16px' 
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                      🧠 AI Emotion Analysis
                    </h4>
                    {analyzing ? (
                      <div className="loading">
                        <div className="spinner"></div>
                        <span>Analyzing emotional tone...</span>
                      </div>
                    ) : emotionResult && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: '20px',
                          background: emotionResult.emotion === 'POSITIVE' ? '#DCFCE7' : 
                                     emotionResult.emotion === 'NEGATIVE' ? '#FEE2E2' : '#F3F4F6',
                          color: emotionResult.emotion === 'POSITIVE' ? '#166534' : 
                                 emotionResult.emotion === 'NEGATIVE' ? '#DC2626' : '#374151',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {emotionResult.emotion}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          Confidence: {(emotionResult.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Prompts */}
            {!isEditing && formData.content.length < 10 && (
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
                    <span>{isEditing ? 'Updating...' : 'Saving...'}</span>
                  </div>
                ) : (
                  <>
                    {isEditing ? 'Update Memory' : 'Save Memory'}
                    <span>✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;