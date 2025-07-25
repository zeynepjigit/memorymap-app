import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeEmotion } from '../services/api';

const DiaryEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [emotionError, setEmotionError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'content') {
      triggerEmotionAnalysis(e.target.value);
    }
  };

  const triggerEmotionAnalysis = async (text) => {
    if (!text || text.length < 5) {
      setEmotionResult(null);
      return;
    }
    setEmotionLoading(true);
    setEmotionError(null);
    const result = await analyzeEmotion(text);
    if (result.success) {
      setEmotionResult(result.data);
    } else {
      setEmotionError(result.error);
      setEmotionResult(null);
    }
    setEmotionLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate saving the entry
      setTimeout(() => {
        const entry = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setSavedEntry(entry);
        setLoading(false);
        
        // Show success message and redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving diary entry:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (savedEntry) {
    return (
      <div className="form-container">
        <div className="alert alert-success">
          <h3>✅ Entry Saved Successfully!</h3>
          <p>Your memory "{savedEntry.title}" has been saved to your journal.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-entry-page">
      <h2>{isEditing ? 'Günlük Düzenle' : 'Yeni Günlük Oluştur'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Memory Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your memory a memorable title..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location (Optional)</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where did this happen? (e.g., Paris, France)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Your Memory</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Günlük içeriği"
            rows={6}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          {/* Duygu Analizi Sonucu */}
          <div style={{ marginBottom: '10px' }}>
            {emotionLoading && <span>Duygu analizi yapılıyor...</span>}
            {emotionError && <span style={{ color: 'red' }}>Duygu analizi hatası: {emotionError}</span>}
            {emotionResult && (
              <span style={{ color: emotionResult.emotion === 'POSITIVE' ? 'green' : emotionResult.emotion === 'NEGATIVE' ? 'red' : 'gray' }}>
                Duygu: <b>{emotionResult.emotion}</b> (Güven: {(emotionResult.confidence * 100).toFixed(1)}%)
              </span>
            )}
          </div>
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 'var(--space-2)', display: 'block' }}>
            Tip: Include details about what you saw, felt, and experienced to make your memory more vivid.
          </small>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : isEditing ? 'Günlüğü Güncelle' : 'Günlük Oluştur'}
          </button>
        </div>
      </form>

      {/* Writing Tips */}
      <div className="card" style={{ marginTop: 'var(--space-8)' }}>
        <div className="card-header">
          <h3 className="card-title">💡 Writing Tips</h3>
        </div>
        <div className="card-body">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span>🎨</span>
              <span>Use vivid descriptions to paint a picture with words</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span>💭</span>
              <span>Include your emotions and what the experience meant to you</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span>📍</span>
              <span>Mention specific places, people, or details that made it special</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span>🌟</span>
              <span>Don't worry about perfect grammar - focus on capturing the moment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry; 