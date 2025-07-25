const API_BASE_URL = 'http://127.0.0.1:8000';

// API service functions

// Backend bağlantısını test et
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Firebase bağlantısını test et
export const testFirebaseConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test/firebase`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Diary API Functions

// Yeni günlük girişi oluştur
export const createDiaryEntry = async (entryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: entryData.title,
        content: entryData.content,
        location: entryData.location || null,
        mood: entryData.mood || null
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create diary entry');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Günlük girişlerini listele
export const getDiaryEntries = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/?limit=${limit}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get diary entries');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Tekil günlük girişi getir
export const getDiaryEntry = async (entryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/${entryId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get diary entry');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Günlük girişini güncelle
export const updateDiaryEntry = async (entryId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to update diary entry');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Günlük girişini sil
export const deleteDiaryEntry = async (entryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/${entryId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to delete diary entry');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Duygu analizi fonksiyonu
export const analyzeEmotion = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/emotion/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Duygu analizi başarısız');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 