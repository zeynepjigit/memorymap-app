import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';

// Firebase yapılandırması (gerçek projede environment variables'dan okunmalı)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "memorymap-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "memorymap-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "memorymap-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Analytics olay takibi fonksiyonları
export const analyticsEvents = {
  // Kullanıcı olayları
  userLogin: (method) => {
    logEvent(analytics, 'login', { method });
  },

  userRegister: (method) => {
    logEvent(analytics, 'sign_up', { method });
  },

  userLogout: () => {
    logEvent(analytics, 'logout');
  },

  // Günlük girişi olayları
  diaryEntryCreated: (wordCount, emotion) => {
    logEvent(analytics, 'diary_entry_created', {
      word_count: wordCount,
      emotion: emotion,
      content_type: 'diary_entry'
    });
  },

  diaryEntryAnalyzed: (analysisType, success) => {
    logEvent(analytics, 'diary_analysis', {
      analysis_type: analysisType,
      success: success
    });
  },

  // AI özellik kullanımı
  emotionAnalysisUsed: (textLength, result) => {
    logEvent(analytics, 'emotion_analysis_used', {
      text_length: textLength,
      result: result
    });
  },

  locationExtractionUsed: (locationsFound) => {
    logEvent(analytics, 'location_extraction_used', {
      locations_found: locationsFound
    });
  },

  imageGenerationUsed: (prompt, success) => {
    logEvent(analytics, 'image_generation_used', {
      prompt_length: prompt.length,
      success: success
    });
  },

  // Koçluk özelliği
  reflectiveQuestionsGenerated: (questionCount) => {
    logEvent(analytics, 'reflective_questions_generated', {
      question_count: questionCount
    });
  },

  personalAdviceRequested: (entryCount) => {
    logEvent(analytics, 'personal_advice_requested', {
      entry_count: entryCount
    });
  },

  // Galeri olayları
  galleryViewed: (imageCount) => {
    logEvent(analytics, 'gallery_viewed', {
      image_count: imageCount
    });
  },

  imageDownloaded: (imageId) => {
    logEvent(analytics, 'image_downloaded', {
      image_id: imageId
    });
  },

  imageFavorited: (imageId, action) => {
    logEvent(analytics, 'image_favorited', {
      image_id: imageId,
      action: action // 'add' or 'remove'
    });
  },

  // Harita olayları
  mapViewed: (memoryCount) => {
    logEvent(analytics, 'map_viewed', {
      memory_count: memoryCount
    });
  },

  mapMarkerClicked: (memoryId) => {
    logEvent(analytics, 'map_marker_clicked', {
      memory_id: memoryId
    });
  },

  // Sayfa görüntüleme
  pageView: (pageName) => {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  },

  // Hata takibi
  errorOccurred: (errorType, errorMessage) => {
    logEvent(analytics, 'error_occurred', {
      error_type: errorType,
      error_message: errorMessage
    });
  },

  // Kullanıcı etkileşimi
  buttonClicked: (buttonName, location) => {
    logEvent(analytics, 'button_clicked', {
      button_name: buttonName,
      location: location
    });
  },

  searchPerformed: (searchTerm, resultCount) => {
    logEvent(analytics, 'search', {
      search_term: searchTerm,
      result_count: resultCount
    });
  }
};

// Kullanıcı özelliklerini ayarla
export const setAnalyticsUser = (userId, userProperties = {}) => {
  setUserId(analytics, userId);
  setUserProperties(analytics, {
    user_type: userProperties.userType || 'free',
    signup_date: userProperties.signupDate || new Date().toISOString(),
    ...userProperties
  });
};

// Özel metrik takibi
export const trackCustomMetric = (metricName, value, parameters = {}) => {
  logEvent(analytics, metricName, {
    value: value,
    ...parameters
  });
};

// Performans takibi
export const trackPerformance = (actionName, startTime) => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  logEvent(analytics, 'performance_metric', {
    action: actionName,
    duration: duration,
    timestamp: endTime
  });
};

export default analytics; 