import React, { useState } from 'react';

const MapView = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    { id: 1, name: 'İstanbul', country: 'Türkiye', entries: 12, color: '#ff6b35' },
    { id: 2, name: 'Paris', country: 'Fransa', entries: 8, color: '#6366f1' },
    { id: 3, name: 'Tokyo', country: 'Japonya', entries: 5, color: '#10b981' },
    { id: 4, name: 'New York', country: 'ABD', entries: 3, color: '#f59e0b' },
    { id: 5, name: 'Roma', country: 'İtalya', entries: 7, color: '#ef4444' }
  ];

  return (
    <div className="dear-diary-container">
      <div className="main-content-area">
        <div className="dear-diary-header">
          <h1 className="dear-diary-title">Harita Görünümü</h1>
        </div>

        <div style={{ padding: 16 }}>
          <div className="card card-elevated" style={{ maxWidth: 800, margin: '0 auto' }}>
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
                🗺️
              </div>
              <div className="heading">Anılarınızın Haritası</div>
              <div className="muted">Gezdiğiniz yerlerdeki anılarınızı keşfedin</div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ 
                height: 300, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: 48, opacity: 0.3 }}>🌍</div>
                {locations.map((loc, index) => (
                  <div
                    key={loc.id}
                    style={{
                      position: 'absolute',
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: loc.color,
                      cursor: 'pointer',
                      transform: selectedLocation?.id === loc.id ? 'scale(1.5)' : 'scale(1)',
                      transition: 'all 0.3s',
                      boxShadow: selectedLocation?.id === loc.id ? '0 0 20px rgba(0,0,0,0.3)' : 'none'
                    }}
                    onClick={() => setSelectedLocation(loc)}
                  />
                ))}
              </div>

              <div className="grid-3">
                {locations.map(loc => (
                  <div 
                    key={loc.id} 
                    className="card"
                    style={{ 
                      cursor: 'pointer',
                      border: selectedLocation?.id === loc.id ? `2px solid ${loc.color}` : '1px solid #e5e7eb'
                    }}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        background: loc.color 
                      }} />
                      <div className="heading">{loc.name}</div>
                    </div>
                    <div className="muted">{loc.country}</div>
                    <div style={{ marginTop: 4, fontWeight: 600, color: loc.color }}>
                      {loc.entries} giriş
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView; 