import React, { useState } from 'react';
import { analyticsEvents } from '../services/analytics';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    category: 'general',
    message: '',
    features: [],
    improvements: '',
    recommend: true,
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'ui_ux', label: 'User Interface & Experience' },
    { value: 'ai_features', label: 'AI Features' },
    { value: 'performance', label: 'Performance' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'feature_request', label: 'Feature Request' }
  ];

  const features = [
    'Diary Entry Creation',
    'Emotion Analysis',
    'Location Extraction',
    'AI Image Generation',
    'Memory Map',
    'Reflective Questions',
    'Gallery Management',
    'Analytics Dashboard'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'features') {
      const updatedFeatures = checked
        ? [...feedback.features, value]
        : feedback.features.filter(f => f !== value);
      setFeedback({ ...feedback, features: updatedFeatures });
    } else if (type === 'checkbox') {
      setFeedback({ ...feedback, [name]: checked });
    } else {
      setFeedback({ ...feedback, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/emotion/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedback)
      });

      if (response.ok) {
        setSubmitted(true);
        analyticsEvents.buttonClicked('feedback_submitted', 'feedback_page');
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h1>🎉 Thank You!</h1>
          <p>Your feedback has been submitted successfully.</p>
          <p>We appreciate your input and will use it to improve MemoryMap.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/dashboard'}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">📝 Share Your Feedback</h1>
      <p className="page-subtitle">Help us improve MemoryMap with your valuable feedback</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Overall Rating */}
          <div className="form-group">
            <label htmlFor="rating">Overall Rating:</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  style={{
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: star <= feedback.rating ? '#ffd700' : '#ddd'
                  }}
                  onClick={() => setFeedback({ ...feedback, rating: star })}
                >
                  ⭐
                </span>
              ))}
              <span style={{ marginLeft: '10px' }}>
                {feedback.rating}/5 stars
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Feedback Category:</label>
            <select
              id="category"
              name="category"
              value={feedback.category}
              onChange={handleInputChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Your Feedback:</label>
            <textarea
              id="message"
              name="message"
              value={feedback.message}
              onChange={handleInputChange}
              placeholder="Please share your thoughts, suggestions, or issues..."
              rows="6"
              required
            />
          </div>

          {/* Features Used */}
          <div className="form-group">
            <label>Which features have you used? (Check all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {features.map(feature => (
                <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="features"
                    value={feature}
                    checked={feedback.features.includes(feature)}
                    onChange={handleInputChange}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="form-group">
            <label htmlFor="improvements">What would you like to see improved?</label>
            <textarea
              id="improvements"
              name="improvements"
              value={feedback.improvements}
              onChange={handleInputChange}
              placeholder="Suggestions for improvements or new features..."
              rows="4"
            />
          </div>

          {/* Recommendation */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="recommend"
                checked={feedback.recommend}
                onChange={handleInputChange}
              />
              I would recommend MemoryMap to others
            </label>
          </div>

          {/* Email (Optional) */}
          <div className="form-group">
            <label htmlFor="email">Email (Optional - for follow-up):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={feedback.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Stats */}
      <div className="card">
        <h2>📊 Community Feedback</h2>
        <p>Your feedback helps us build a better experience for everyone!</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>4.8</div>
            <div>Average Rating</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>156</div>
            <div>Total Reviews</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>89%</div>
            <div>Would Recommend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 