import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserImages } from '../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getUserImages();
      if (result.success && result.data.images) {
        setImages(result.data.images);
        setError(null);
      } else {
        setError(result.error || 'Görseller alınamadı');
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">MemoryMap</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/coaching" className="nav-link">AI Coach</Link></li>
            <li><Link to="/gallery" className="nav-link" style={{ color: 'var(--primary-purple)' }}>Gallery</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <div className="main-content">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Memory Gallery</h1>
          <p className="section-subtitle">
            Visual representations of your memories and AI-generated artwork
          </p>
        </div>

        <div style={{ padding: 16 }}>
          {loading ? (
            <div className="card">Yükleniyor...</div>
          ) : error ? (
            <div className="card" style={{ color: 'crimson' }}>{error}</div>
          ) : images.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>📸</div>
              Henüz görsel yok
            </div>
          ) : (
            <div className="grid-3">
              {images.map((img, i) => (
                <div key={i} className="card card-elevated">
                  <img src={img.url} alt={img.filename} style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} />
                  <div style={{ fontWeight: 700 }}>{img.filename}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery; 