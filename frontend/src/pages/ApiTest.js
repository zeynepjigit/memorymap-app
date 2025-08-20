import React, { useState } from 'react';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const tests = [
    { id: 'emotion', name: 'Duygu Analizi', endpoint: '/api/emotion/analyze', status: 'pending' },
    { id: 'location', name: 'Konum Çıkarımı', endpoint: '/api/location/extract', status: 'pending' },
    { id: 'image', name: 'Görsel Üretimi', endpoint: '/api/image/generate', status: 'pending' },
    { id: 'coaching', name: 'AI Koçluk', endpoint: '/api/coaching/advice', status: 'pending' },
    { id: 'rag', name: 'RAG Sistemi', endpoint: '/api/coaching/query', status: 'pending' }
  ];

  const runTest = async (testId) => {
    setLoading(true);
    setTestResults(prev => ({ ...prev, [testId]: { status: 'running', message: 'Test çalışıyor...' } }));

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          status: success ? 'success' : 'error',
          message: success ? 'Test başarılı!' : 'Test başarısız'
        }
      }));
      setLoading(false);
    }, 2000);
  };

  const runAllTests = () => {
    tests.forEach(test => runTest(test.id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'running': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      default: return '⏸️';
    }
  };

  return (
    <div className="dear-diary-container">
      <div className="main-content-area">
        <div className="dear-diary-header">
          <h1 className="dear-diary-title">API Test</h1>
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
                🧪
              </div>
              <div className="heading">API Test Merkezi</div>
              <div className="muted">Sistem bileşenlerini test edin</div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="button-primary" onClick={runAllTests} disabled={loading}>
                  Tümünü Test Et
                </button>
                <button className="button-ghost" onClick={() => setTestResults({})}>
                  Sonuçları Temizle
                </button>
              </div>

              <div className="grid-2">
                {tests.map((test) => (
                  <div key={test.id} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div className="heading">{test.name}</div>
                      <div style={{ 
                        fontSize: 20,
                        color: getStatusColor(testResults[test.id]?.status || 'pending')
                      }}>
                        {getStatusIcon(testResults[test.id]?.status || 'pending')}
                      </div>
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
                      {test.endpoint}
                    </div>
                    {testResults[test.id] && (
                      <div style={{ 
                        fontSize: 14, 
                        color: getStatusColor(testResults[test.id].status),
                        fontWeight: 600
                      }}>
                        {testResults[test.id].message}
                      </div>
                    )}
                    <button
                      className="button-ghost"
                      style={{ marginTop: 8, width: '100%' }}
                      onClick={() => runTest(test.id)}
                      disabled={loading}
                    >
                      Test Et
                    </button>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: 16 }}>
                <div className="heading" style={{ marginBottom: 12 }}>Test Sonuçları Özeti</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {tests.map(test => {
                    const result = testResults[test.id];
                    return (
                      <div key={test.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{getStatusIcon(result?.status || 'pending')}</span>
                        <span style={{ flex: 1 }}>{test.name}</span>
                        <span style={{ 
                          fontSize: 12, 
                          color: getStatusColor(result?.status || 'pending'),
                          fontWeight: 600
                        }}>
                          {result?.status || 'bekliyor'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 