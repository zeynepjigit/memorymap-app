import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiaryEntry from './pages/DiaryEntry';
import CoachingDashboard from './pages/CoachingDashboard';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import FeedbackForm from './pages/FeedbackForm';
import DreamVisualization from './pages/DreamVisualization';
import MapView from './pages/MapView';
import NotificationSettings from './pages/NotificationSettings';
import ApiTest from './pages/ApiTest';

// Components
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            {/* Ana Sayfa */}
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              } 
            />

            {/* Kimlik Doğrulama */}
            <Route 
              path="/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login />
                </motion.div>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Register />
                </motion.div>
              } 
            />

            {/* Ana Uygulama Sayfaları */}
            <Route 
              path="/dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              } 
            />

            <Route 
              path="/diary-entry" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DiaryEntry />
                </motion.div>
              } 
            />

            <Route 
              path="/coaching" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CoachingDashboard />
                </motion.div>
              } 
            />

            <Route 
              path="/gallery" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Gallery />
                </motion.div>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Profile />
                </motion.div>
              } 
            />

            {/* Ek Özellikler */}
            <Route 
              path="/feedback" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Feedback />
                </motion.div>
              } 
            />

            <Route 
              path="/feedback-form" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeedbackForm />
                </motion.div>
              } 
            />

            <Route 
              path="/dream-visualization" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DreamVisualization />
                </motion.div>
              } 
            />

            <Route 
              path="/map-view" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapView />
                </motion.div>
              } 
            />

            <Route 
              path="/notification-settings" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationSettings />
                </motion.div>
              } 
            />

            {/* Test Sayfası */}
            <Route 
              path="/api-test" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApiTest />
                </motion.div>
              } 
            />

            {/* 404 - Sayfa Bulunamadı */}
            <Route 
              path="*" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="dear-diary-container"
                >
                  <div className="main-content-area">
                    <div className="dear-diary-header">
                      <h1 className="dear-diary-title">404</h1>
                    </div>
                    <div className="p-8 text-center">
                      <div style={{ fontSize: '64px', marginBottom: '24px' }}>😕</div>
                      <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
                      <p className="text-gray-600 mb-8">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                      </p>
                      <motion.button
                        onClick={() => window.history.back()}
                        className="modern-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Geri Dön
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              } 
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 