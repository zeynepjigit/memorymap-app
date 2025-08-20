import React, { useState } from 'react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    dailyReminder: true,
    weeklyInsights: true,
    newFeatures: false,
    aiSuggestions: true,
    emotionAlerts: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    { key: 'dailyReminder', label: 'Günlük Hatırlatıcı', description: 'Her gün günlük yazmanız için hatırlatma', icon: '📝' },
    { key: 'weeklyInsights', label: 'Haftalık Analiz', description: 'Haftalık duygu analizi raporu', icon: '📊' },
    { key: 'newFeatures', label: 'Yeni Özellikler', description: 'Yeni özellikler hakkında bilgilendirme', icon: '✨' },
    { key: 'aiSuggestions', label: 'AI Önerileri', description: 'Kişiselleştirilmiş AI önerileri', icon: '🤖' },
    { key: 'emotionAlerts', label: 'Duygu Uyarıları', description: 'Duygu durumunuzdaki değişiklikler', icon: '💭' }
  ];

  return (
    <div className="dear-diary-container">
      <div className="main-content-area">
        <div className="dear-diary-header">
          <h1 className="dear-diary-title">Bildirim Ayarları</h1>
        </div>

        <div style={{ padding: 16 }}>
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
                🔔
              </div>
              <div className="heading">Bildirim Tercihleriniz</div>
              <div className="muted">Hangi bildirimleri almak istediğinizi seçin</div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {notificationTypes.map((type) => (
                <div key={type.key} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 24 }}>{type.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="heading">{type.label}</div>
                    <div className="muted">{type.description}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(type.key)}
                    style={{
                      width: 48,
                      height: 24,
                      borderRadius: 12,
                      background: settings[type.key] ? '#10b981' : '#e5e7eb',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: 2,
                      left: settings[type.key] ? 26 : 2,
                      transition: 'all 0.3s'
                    }} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <button className="button-primary">
                Ayarları Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
