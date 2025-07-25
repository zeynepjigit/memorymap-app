import React, { useState, useEffect } from 'react';
import { 
  testBackendConnection, 
  testFirebaseConnection, 
  getDiaryEntries, 
  createDiaryEntry 
} from '../services/api';

const ApiTest = () => {
  const [tests, setTests] = useState({
    backend: { status: 'pending', message: '', data: null },
    firebase: { status: 'pending', message: '', data: null },
    diaryList: { status: 'pending', message: '', data: null }
  });

  const [newEntry, setNewEntry] = useState({
    title: 'Test Günlük',
    content: 'Bu bir test günlük girişidir.',
    location: 'Test Lokasyon',
    mood: 'Mutlu'
  });

  const runTest = async (testName, testFunction) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status: 'loading', message: 'Testing...', data: null }
    }));

    const result = await testFunction();
    
    setTests(prev => ({
      ...prev,
      [testName]: {
        status: result.success ? 'success' : 'error',
        message: result.success ? 'Success!' : result.error,
        data: result.data
      }
    }));
  };

  const testBackend = () => runTest('backend', testBackendConnection);
  const testFirebase = () => runTest('firebase', testFirebaseConnection);
  const testDiaryList = () => runTest('diaryList', getDiaryEntries);

  const createTestEntry = async () => {
    const result = await createDiaryEntry(newEntry);
    if (result.success) {
      alert('Günlük başarıyla oluşturuldu!');
      testDiaryList(); // Listeyi yenile
    } else {
      alert('Hata: ' + result.error);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde tüm testleri çalıştır
    testBackend();
    testFirebase();
    testDiaryList();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'loading': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔗 Frontend-Backend Bağlantı Testi</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Bağlantı Testleri</h2>
        
        {/* Backend Test */}
        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(tests.backend.status) 
            }}></span>
            <strong>Backend Bağlantısı</strong>
            <button onClick={testBackend} style={{ marginLeft: 'auto' }}>Test Et</button>
          </div>
          <p>Status: {tests.backend.message}</p>
          {tests.backend.data && (
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
              {JSON.stringify(tests.backend.data, null, 2)}
            </pre>
          )}
        </div>

        {/* Firebase Test */}
        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(tests.firebase.status) 
            }}></span>
            <strong>Firebase Bağlantısı</strong>
            <button onClick={testFirebase} style={{ marginLeft: 'auto' }}>Test Et</button>
          </div>
          <p>Status: {tests.firebase.message}</p>
          {tests.firebase.data && (
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
              {JSON.stringify(tests.firebase.data, null, 2)}
            </pre>
          )}
        </div>

        {/* Diary List Test */}
        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(tests.diaryList.status) 
            }}></span>
            <strong>Günlük Listesi</strong>
            <button onClick={testDiaryList} style={{ marginLeft: 'auto' }}>Yenile</button>
          </div>
          <p>Status: {tests.diaryList.message}</p>
          {tests.diaryList.data && tests.diaryList.data.entries && (
            <div>
              <p><strong>Toplam Günlük: {tests.diaryList.data.count}</strong></p>
              {tests.diaryList.data.entries.map((entry, index) => (
                <div key={entry.id} style={{ 
                  backgroundColor: '#f9f9f9', 
                  padding: '10px', 
                  margin: '5px 0', 
                  borderRadius: '5px' 
                }}>
                  <h4>{entry.title}</h4>
                  <p>{entry.content}</p>
                  <small>📍 {entry.location} | 😊 {entry.mood} | 🕒 {new Date(entry.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2>Yeni Günlük Oluştur</h2>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <input 
            type="text" 
            placeholder="Başlık" 
            value={newEntry.title}
            onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea 
            placeholder="İçerik" 
            value={newEntry.content}
            onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', height: '80px' }}
          />
          <input 
            type="text" 
            placeholder="Lokasyon" 
            value={newEntry.location}
            onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
            style={{ width: '48%', padding: '8px', marginBottom: '10px', marginRight: '4%' }}
          />
          <input 
            type="text" 
            placeholder="Ruh Hali" 
            value={newEntry.mood}
            onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
            style={{ width: '48%', padding: '8px', marginBottom: '10px' }}
          />
          <button 
            onClick={createTestEntry}
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Günlük Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 