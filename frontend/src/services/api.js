const API_BASE_URL = 'http://127.0.0.1:8000';

// Auth helpers
const getToken = () => {
  try { return localStorage.getItem('token'); } catch { return null; }
};
const withAuth = (headers = {}) => {
  const token = getToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

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
      headers: withAuth({ 'Content-Type': 'application/json' }),
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
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/?limit=${limit}`, {
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
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
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/${entryId}`, {
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
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
      headers: withAuth({ 'Content-Type': 'application/json' }),
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
      method: 'DELETE',
      headers: withAuth({ 'Content-Type': 'application/json' }),
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
      headers: withAuth({ 'Content-Type': 'application/json' }),
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

// Konum çıkarımı fonksiyonu
export const extractLocation = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/location/extract`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Konum çıkarımı başarısız');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Konumdan koordinat alma fonksiyonu
export const getCoordinates = async (locationName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/location/coordinates`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ location_name: locationName })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Koordinat bulunamadı');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Görsel üretimi (Stable Diffusion)
export const generateImageFromDiary = async ({ diary_text, emotion, locations }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/image/generate`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ diary_text, emotion, locations })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Görsel üretimi başarısız');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Görseli storage'a kaydet
export const saveImageToStorage = async ({ image_base64, title }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/image/save`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ image_base64, title })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Görsel kaydı başarısız');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Kullanıcının galeri görsellerini al
export const getUserImages = async () => {
  try {
    // Build images list from diary entries' media.image_url
    const response = await fetch(`${API_BASE_URL}/api/v1/diary/?limit=50`, {
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Entries not available');
    const entries = data.entries || [];
    const images = entries
      .map((e) => ({ url: e?.media?.image_url, filename: e.title || e.id }))
      .filter((i) => i.url);
    return { success: true, data: { images } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Kişiselleştirilmiş motivasyon kartı al
export const getPersonalizedMotivationCard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/notifications/personalized`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Motivasyon kartı alınamadı');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Kullanıcıya özel analitik verileri al
export const getUserAnalytics = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/analytics/user?days=${days}`, {
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Analitik veriler alınamadı');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 

// Koçluk: Yansıtıcı sorular al
export const getReflectiveQuestions = async ({ diary_text, emotion, user_history }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/coaching/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ diary_text, emotion, user_history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Yansıtıcı sorular alınamadı');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Koçluk: Kişisel gelişim önerisi al
export const getPersonalAdvice = async ({ diary_entries, emotions }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/coaching/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ diary_entries, emotions })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Kişisel gelişim önerisi alınamadı');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Koçluk: Kullanıcı gelişim analizi
export const analyzeUserProgress = async ({ user_responses, time_period_days = 30 }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion/coaching/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_responses, time_period_days })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Gelişim analizi alınamadı');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// RAG Coaching API Functions

// Genel API servis objesi
export const apiService = {
  // GET request
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // POST request
  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // PUT request
  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: withAuth({ 'Content-Type': 'application/json' }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// RAG Coaching specific functions
export const addDiaryEntryToVectorDB = async (entryData) => {
  return apiService.post('/coaching/add-entry', entryData);
};

export const queryDiaryEntries = async (question, topK = 5) => {
  return apiService.post('/coaching/query', { question, top_k: topK });
};

export const getPersonalizedAdvice = async (question) => {
  console.log('API: getPersonalizedAdvice called with:', question.substring(0, 100) + '...');
  try {
    const result = await apiService.post('/api/v1/coach/chat', { message: question });
    console.log('API: getPersonalizedAdvice result:', result);
    return result;
  } catch (error) {
    console.error('API: getPersonalizedAdvice error:', error);
    return { success: false, error: error.message };
  }
};

export const getEmotionalInsights = async () => {
  return apiService.get('/coaching/insights');
};

export const getDemoData = async () => {
  return apiService.get('/coaching/demo-data');
}; 

// Smart Editor
export const editorSuggest = async ({ text, intent, target_tone }) => {
  console.log('API: editorSuggest called with:', { text: text.substring(0, 100) + '...', intent, target_tone });
  try {
    const result = await apiService.post('/api/v1/editor/suggest', { text, intent, target_tone });
    console.log('API: editorSuggest result:', result);
    return result;
  } catch (error) {
    console.error('API: editorSuggest error:', error);
    return { success: false, error: error.message };
  }
};


// Profile API
export const getMyProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to load profile');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMyProfile = async (update) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(update),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update profile');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth API
export const authLogin = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const authRegister = async ({ email, username, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Registration failed');
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Quote Generation API Functions
export const generateInspirationalQuote = async ({ emotion, diary_content = "" }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/quotes/generate`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ emotion, diary_content })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to generate quote');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getQuoteHistory = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/quotes/history?limit=${limit}`, {
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get quote history');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getEmotionColors = async (emotion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/quotes/colors/${emotion}`, {
      headers: withAuth({ 'Content-Type': 'application/json' }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get emotion colors');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};