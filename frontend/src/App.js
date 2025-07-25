import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiaryEntry from './pages/DiaryEntry';
import MapView from './pages/MapView';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import ApiTest from './pages/ApiTest';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diary/new" element={<DiaryEntry />} />
            <Route path="/diary/:id" element={<DiaryEntry />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test" element={<ApiTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 