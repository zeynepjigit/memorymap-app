import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="dear-diary-container">
      <div className="main-content-area">
        <div className="dear-diary-header">
          <h1 className="dear-diary-title">İletişim</h1>
        </div>

        <div style={{ padding: 16 }}>
          {!submitted ? (
            <div className="card card-elevated" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'var(--gradient-orange)', 
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  color: 'white'
                }}>
                  📧
                </div>
                <div className="heading">Bizimle İletişime Geçin</div>
                <div className="muted">Sorularınız için buradayız</div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input-field"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input-field"
                  type="text"
                  name="subject"
                  placeholder="Konu"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="input-field"
                  style={{ borderRadius: 16, minHeight: 120 }}
                  name="message"
                  placeholder="Mesajınız..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="button-primary">
                  Gönder
                </button>
              </form>
            </div>
          ) : (
            <div className="card card-elevated" style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: '#10b981', 
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: 'white'
              }}>
                ✅
              </div>
              <div className="heading">Mesajınız Gönderildi!</div>
              <div className="muted">En kısa sürede size dönüş yapacağız</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
